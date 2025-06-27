/*
  # Create analytics views and functions for reporting

  1. Views
    - `pathogen_summary_by_section` - Summary of pathogen incidence by section
    - `incidence_summary_by_row` - Summary of pest incidence by greenhouse row
    - `user_activity_summary` - Summary of user activities
    - `supply_expiration_alerts` - Supplies expiring soon
    - `tool_maintenance_alerts` - Tools needing maintenance

  2. Functions
    - `get_pathogen_statistics()` - Get pathogen statistics
    - `get_incidence_heatmap_data()` - Get heatmap data for visualization
*/

-- Create view for pathogen summary by section
CREATE OR REPLACE VIEW pathogen_summary_by_section AS
SELECT 
  cs.id as section_id,
  cs.name as section_name,
  cs.max_trees,
  COUNT(cpr.id) as total_records,
  COUNT(DISTINCT cpr.tree_number) as affected_trees,
  ROUND(AVG(cpr.incidence_level), 2) as avg_incidence_level,
  MAX(cpr.incidence_level) as max_incidence_level,
  COUNT(CASE WHEN cpr.incidence_level >= 8 THEN 1 END) as critical_cases,
  COUNT(CASE WHEN cpr.incidence_level BETWEEN 5 AND 7 THEN 1 END) as high_cases,
  COUNT(CASE WHEN cpr.incidence_level BETWEEN 3 AND 4 THEN 1 END) as medium_cases,
  COUNT(CASE WHEN cpr.incidence_level <= 2 THEN 1 END) as low_cases
FROM cacao_sections cs
LEFT JOIN cacao_pathogen_records cpr ON cs.id = cpr.section_id
GROUP BY cs.id, cs.name, cs.max_trees
ORDER BY cs.id;

-- Create view for incidence summary by row
CREATE OR REPLACE VIEW incidence_summary_by_row AS
SELECT 
  gr.id as row_id,
  gr.name as row_name,
  COUNT(ir.id) as total_records,
  ROUND(AVG(ir.level), 2) as avg_incidence_level,
  MAX(ir.level) as max_incidence_level,
  COUNT(CASE WHEN ir.level >= 8 THEN 1 END) as critical_cases,
  COUNT(CASE WHEN ir.level BETWEEN 5 AND 7 THEN 1 END) as high_cases,
  COUNT(CASE WHEN ir.level BETWEEN 3 AND 4 THEN 1 END) as medium_cases,
  COUNT(CASE WHEN ir.level <= 2 THEN 1 END) as low_cases,
  MAX(ir.created_at) as last_updated
FROM greenhouse_rows gr
LEFT JOIN incidence_records ir ON gr.id = ir.row_id
GROUP BY gr.id, gr.name
ORDER BY gr.id;

-- Create view for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  up.id as user_id,
  up.full_name,
  up.email,
  up.role,
  up.department,
  COUNT(DISTINCT frs.id) as total_sessions,
  COUNT(CASE WHEN frs.is_active THEN 1 END) as active_sessions,
  MAX(frs.recognition_time) as last_session,
  COUNT(DISTINCT lr.id) as location_changes,
  MAX(lr.created_at) as last_location_update
FROM user_profiles up
LEFT JOIN facial_recognition_sessions frs ON up.id = frs.user_id
LEFT JOIN location_records lr ON up.id = lr.user_id
WHERE up.is_active = true
GROUP BY up.id, up.full_name, up.email, up.role, up.department
ORDER BY up.full_name;

-- Create view for supply expiration alerts
CREATE OR REPLACE VIEW supply_expiration_alerts AS
SELECT 
  sr.id,
  sr.name,
  sr.category,
  sr.expiration_date,
  sr.batch_number,
  sr.supplier,
  sr.assigned_by,
  up.full_name as assigned_to_name,
  CASE 
    WHEN sr.expiration_date < CURRENT_DATE THEN 'EXPIRED'
    WHEN sr.expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRING_SOON'
    ELSE 'OK'
  END as status,
  sr.expiration_date - CURRENT_DATE as days_until_expiration
FROM supply_records sr
LEFT JOIN user_profiles up ON sr.assigned_to = up.id
WHERE sr.expiration_date IS NOT NULL
  AND sr.expiration_date <= CURRENT_DATE + INTERVAL '60 days'
ORDER BY sr.expiration_date ASC;

-- Create view for tool maintenance alerts
CREATE OR REPLACE VIEW tool_maintenance_alerts AS
SELECT 
  tr.id,
  tr.name,
  tr.category,
  tr.condition,
  tr.next_maintenance_date,
  tr.last_maintenance_date,
  tr.assigned_by,
  up.full_name as assigned_to_name,
  CASE 
    WHEN tr.next_maintenance_date < CURRENT_DATE THEN 'OVERDUE'
    WHEN tr.next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'DUE_SOON'
    WHEN tr.condition = 'Necesita mantenimiento' THEN 'NEEDS_MAINTENANCE'
    WHEN tr.condition = 'Fuera de servicio' THEN 'OUT_OF_SERVICE'
    ELSE 'OK'
  END as status,
  tr.next_maintenance_date - CURRENT_DATE as days_until_maintenance
FROM tool_records tr
LEFT JOIN user_profiles up ON tr.assigned_to = up.id
WHERE tr.next_maintenance_date IS NOT NULL
  AND (tr.next_maintenance_date <= CURRENT_DATE + INTERVAL '30 days'
       OR tr.condition IN ('Necesita mantenimiento', 'Fuera de servicio'))
ORDER BY tr.next_maintenance_date ASC;

-- Create function to get pathogen statistics
CREATE OR REPLACE FUNCTION get_pathogen_statistics(
  section_filter text DEFAULT NULL,
  date_from timestamptz DEFAULT NULL,
  date_to timestamptz DEFAULT NULL
)
RETURNS TABLE (
  total_records bigint,
  total_sections bigint,
  total_trees bigint,
  avg_incidence numeric,
  most_common_pathogen text,
  most_affected_section text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(cpr.id) as total_records,
    COUNT(DISTINCT cpr.section_id) as total_sections,
    COUNT(DISTINCT cpr.tree_number) as total_trees,
    ROUND(AVG(cpr.incidence_level), 2) as avg_incidence,
    (SELECT cpr2.pathogen_type 
     FROM cacao_pathogen_records cpr2 
     WHERE (section_filter IS NULL OR cpr2.section_id = section_filter)
       AND (date_from IS NULL OR cpr2.created_at >= date_from)
       AND (date_to IS NULL OR cpr2.created_at <= date_to)
     GROUP BY cpr2.pathogen_type 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) as most_common_pathogen,
    (SELECT cpr3.section_id 
     FROM cacao_pathogen_records cpr3 
     WHERE (section_filter IS NULL OR cpr3.section_id = section_filter)
       AND (date_from IS NULL OR cpr3.created_at >= date_from)
       AND (date_to IS NULL OR cpr3.created_at <= date_to)
     GROUP BY cpr3.section_id 
     ORDER BY AVG(cpr3.incidence_level) DESC 
     LIMIT 1) as most_affected_section
  FROM cacao_pathogen_records cpr
  WHERE (section_filter IS NULL OR cpr.section_id = section_filter)
    AND (date_from IS NULL OR cpr.created_at >= date_from)
    AND (date_to IS NULL OR cpr.created_at <= date_to);
END;
$$ LANGUAGE plpgsql;

-- Create function to get heatmap data
CREATE OR REPLACE FUNCTION get_incidence_heatmap_data(
  date_filter date DEFAULT NULL
)
RETURNS TABLE (
  row_id integer,
  subsection integer,
  avg_level numeric,
  record_count bigint,
  last_updated timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ir.row_id,
    ir.subsection,
    ROUND(AVG(ir.level), 1) as avg_level,
    COUNT(ir.id) as record_count,
    MAX(ir.created_at) as last_updated
  FROM incidence_records ir
  WHERE (date_filter IS NULL OR DATE(ir.created_at) = date_filter)
  GROUP BY ir.row_id, ir.subsection
  ORDER BY ir.row_id, ir.subsection;
END;
$$ LANGUAGE plpgsql;