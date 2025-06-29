import { useState, useRef } from "react";
import { useToolDatabase } from "@/context/ToolDatabaseContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Camera, Upload, X, Wrench, Plus } from "lucide-react";
import { ToolDatabaseItem, ToolCategory } from "@/types/toolDatabase";
import { MultiSelect } from "@/components/MultiSelect";

interface ToolDatabaseFormProps {
  editingTool?: ToolDatabaseItem | null;
  onCancel?: () => void;
  onSave?: () => void;
}

export function ToolDatabaseForm({ editingTool, onCancel, onSave }: ToolDatabaseFormProps) {
  const { data, addTool, updateTool } = useToolDatabase();
  
  const [name, setName] = useState(editingTool?.name || "");
  const [categoryId, setCategoryId] = useState(editingTool?.category.id || "");
  const [description, setDescription] = useState(editingTool?.description || "");
  const [brand, setBrand] = useState(editingTool?.brand || "");
  const [model, setModel] = useState(editingTool?.model || "");
  const [serialNumber, setSerialNumber] = useState(editingTool?.serialNumber || "");
  const [image, setImage] = useState<string>(editingTool?.image || "");
  const [maintenanceInstructions, setMaintenanceInstructions] = useState(editingTool?.maintenanceInstructions || "");
  const [safetyInstructions, setSafetyInstructions] = useState(editingTool?.safetyInstructions || "");
  const [recommendedUses, setRecommendedUses] = useState<string[]>(editingTool?.recommendedUses || []);
  const [technicalSpecifications, setTechnicalSpecifications] = useState(editingTool?.technicalSpecifications || "");
  const [status, setStatus] = useState<'active' | 'maintenance' | 'discontinued' | 'damaged'>(editingTool?.status || 'active');
  const [purchaseDate, setPurchaseDate] = useState(editingTool?.purchaseDate || "");
  const [warrantyExpiration, setWarrantyExpiration] = useState(editingTool?.warrantyExpiration || "");
  const [estimatedLifespan, setEstimatedLifespan] = useState(editingTool?.estimatedLifespan || "");
  const [maintenanceFrequency, setMaintenanceFrequency] = useState(editingTool?.maintenanceFrequency || "");
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(editingTool?.lastMaintenanceDate || "");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState(editingTool?.nextMaintenanceDate || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [newUse, setNewUse] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCapturing(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Error al acceder a la cámara");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setImage(photoData);
        toast.success("Foto capturada correctamente");
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          toast.success("Imagen cargada correctamente");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage("");
    toast.success("Imagen eliminada");
  };

  const handleAddUse = () => {
    if (newUse.trim() && !recommendedUses.includes(newUse.trim())) {
      setRecommendedUses([...recommendedUses, newUse.trim()]);
      setNewUse("");
    }
  };

  const handleRemoveUse = (use: string) => {
    setRecommendedUses(recommendedUses.filter(u => u !== use));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre de la herramienta es obligatorio");
      return;
    }

    if (!categoryId) {
      toast.error("Por favor seleccione una categoría");
      return;
    }

    const category = data.categories.find(c => c.id === categoryId);
    if (!category) {
      toast.error("Categoría no válida");
      return;
    }

    if (!maintenanceInstructions.trim()) {
      toast.error("Las instrucciones de mantenimiento son obligatorias");
      return;
    }

    if (!safetyInstructions.trim()) {
      toast.error("Las instrucciones de seguridad son obligatorias");
      return;
    }

    if (recommendedUses.length === 0) {
      toast.error("Debe especificar al menos un uso recomendado");
      return;
    }

    const toolData: Omit<ToolDatabaseItem, "id" | "createdAt" | "updatedAt"> = {
      name: name.trim(),
      category,
      description: description.trim(),
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      image,
      maintenanceInstructions: maintenanceInstructions.trim(),
      safetyInstructions: safetyInstructions.trim(),
      recommendedUses,
      technicalSpecifications: technicalSpecifications.trim() || undefined,
      status,
      purchaseDate: purchaseDate || undefined,
      warrantyExpiration: warrantyExpiration || undefined,
      estimatedLifespan: estimatedLifespan.trim() || undefined,
      maintenanceFrequency: maintenanceFrequency.trim() || undefined,
      lastMaintenanceDate: lastMaintenanceDate || undefined,
      nextMaintenanceDate: nextMaintenanceDate || undefined,
      createdBy: "admin001" // En una implementación real, esto vendría del usuario actual
    };

    if (editingTool) {
      updateTool(editingTool.id, toolData);
    } else {
      addTool(toolData);
    }

    // Reset form
    setName("");
    setCategoryId("");
    setDescription("");
    setBrand("");
    setModel("");
    setSerialNumber("");
    setImage("");
    setMaintenanceInstructions("");
    setSafetyInstructions("");
    setRecommendedUses([]);
    setTechnicalSpecifications("");
    setStatus('active');
    setPurchaseDate("");
    setWarrantyExpiration("");
    setEstimatedLifespan("");
    setMaintenanceFrequency("");
    setLastMaintenanceDate("");
    setNextMaintenanceDate("");

    onSave?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          {editingTool ? "Editar Herramienta" : "Nueva Herramienta"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Herramienta *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Tijeras de Podar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {data.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada de la herramienta..."
              rows={2}
            />
          </div>

          {/* Información técnica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Fiskars"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej: PowerGear X"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Serie</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ej: PGX-12345"
              />
            </div>
          </div>

          {/* Imagen de la herramienta */}
          <div className="space-y-2">
            <Label>Imagen de la Herramienta</Label>
            <div className="flex gap-2 flex-wrap">
              {!isCapturing ? (
                <>
                  <Button type="button" onClick={startCamera} variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Tomar Foto
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Subir Imagen
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" onClick={capturePhoto} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Capturar
                  </Button>
                  <Button type="button" onClick={stopCamera} variant="outline">
                    Cancelar
                  </Button>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {isCapturing && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {image && (
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Herramienta"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Estado y Especificaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado de la Herramienta *</Label>
              <Select value={status} onValueChange={(value: 'active' | 'maintenance' | 'discontinued' | 'damaged') => setStatus(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                  <SelectItem value="discontinued">Descontinuada</SelectItem>
                  <SelectItem value="damaged">Dañada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalSpecifications">Especificaciones Técnicas</Label>
              <Input
                id="technicalSpecifications"
                value={technicalSpecifications}
                onChange={(e) => setTechnicalSpecifications(e.target.value)}
                placeholder="Ej: Capacidad de corte: 25mm. Material: Acero."
              />
            </div>
          </div>

          {/* Usos recomendados */}
          <div className="space-y-2">
            <Label htmlFor="recommendedUses">Usos Recomendados *</Label>
            <div className="flex gap-2">
              <Input
                id="newUse"
                value={newUse}
                onChange={(e) => setNewUse(e.target.value)}
                placeholder="Ej: Poda de ramas pequeñas"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddUse}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Añadir
              </Button>
            </div>
            
            {recommendedUses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendedUses.map((use, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {use}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveUse(use)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            {recommendedUses.length === 0 && (
              <p className="text-xs text-red-500">Añada al menos un uso recomendado</p>
            )}
          </div>

          {/* Instrucciones */}
          <div className="space-y-2">
            <Label htmlFor="maintenanceInstructions">Instrucciones de Mantenimiento *</Label>
            <Textarea
              id="maintenanceInstructions"
              value={maintenanceInstructions}
              onChange={(e) => setMaintenanceInstructions(e.target.value)}
              placeholder="Instrucciones detalladas de mantenimiento, limpieza, lubricación, etc..."
              rows={3}
              required
            />
          </div>

          {/* Información de seguridad */}
          <div className="space-y-2">
            <Label htmlFor="safetyInstructions">Instrucciones de Seguridad *</Label>
            <Textarea
              id="safetyInstructions"
              value={safetyInstructions}
              onChange={(e) => setSafetyInstructions(e.target.value)}
              placeholder="Precauciones, equipo de protección requerido, advertencias, etc..."
              rows={3}
              required
            />
          </div>

          {/* Fechas de mantenimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceFrequency">Frecuencia de Mantenimiento</Label>
              <Input
                id="maintenanceFrequency"
                value={maintenanceFrequency}
                onChange={(e) => setMaintenanceFrequency(e.target.value)}
                placeholder="Ej: Semanal, Mensual, Después de cada uso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedLifespan">Vida Útil Estimada</Label>
              <Input
                id="estimatedLifespan"
                value={estimatedLifespan}
                onChange={(e) => setEstimatedLifespan(e.target.value)}
                placeholder="Ej: 5 años"
              />
            </div>
          </div>

          {/* Fechas importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Fecha de Compra</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiration">Vencimiento de Garantía</Label>
              <Input
                id="warrantyExpiration"
                type="date"
                value={warrantyExpiration}
                onChange={(e) => setWarrantyExpiration(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastMaintenanceDate">Último Mantenimiento</Label>
              <Input
                id="lastMaintenanceDate"
                type="date"
                value={lastMaintenanceDate}
                onChange={(e) => setLastMaintenanceDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceDate">Próximo Mantenimiento</Label>
              <Input
                id="nextMaintenanceDate"
                type="date"
                value={nextMaintenanceDate}
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingTool ? "Actualizar Herramienta" : "Crear Herramienta"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}