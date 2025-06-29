import { useState, useRef } from "react";
import { useSupplyDatabase } from "@/context/SupplyDatabaseContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Camera, Upload, X, Package, Plus } from "lucide-react";
import { SupplyDatabaseItem, SupplyCategory, ApplicationMethod, APPLICATION_METHODS } from "@/types/supplyDatabase";
import { MultiSelect } from "@/components/MultiSelect";

interface SupplyDatabaseFormProps {
  editingSupply?: SupplyDatabaseItem | null;
  onCancel?: () => void;
  onSave?: () => void;
}

export function SupplyDatabaseForm({ editingSupply, onCancel, onSave }: SupplyDatabaseFormProps) {
  const { data, addSupply, updateSupply } = useSupplyDatabase();
  
  const [name, setName] = useState(editingSupply?.name || "");
  const [categoryId, setCategoryId] = useState(editingSupply?.category.id || "");
  const [description, setDescription] = useState(editingSupply?.description || "");
  const [activeIngredient, setActiveIngredient] = useState(editingSupply?.activeIngredient || "");
  const [concentration, setConcentration] = useState(editingSupply?.concentration || "");
  const [image, setImage] = useState<string>(editingSupply?.image || "");
  const [instructions, setInstructions] = useState(editingSupply?.instructions || "");
  const [recommendedDose, setRecommendedDose] = useState(editingSupply?.recommendedDose || "");
  const [targetPests, setTargetPests] = useState<string[]>(editingSupply?.targetPests || []);
  const [applicationMethods, setApplicationMethods] = useState<ApplicationMethod[]>(editingSupply?.applicationMethods || []);
  const [safetyNotes, setSafetyNotes] = useState(editingSupply?.safetyNotes || "");
  const [manufacturer, setManufacturer] = useState(editingSupply?.manufacturer || "");
  const [registrationNumber, setRegistrationNumber] = useState(editingSupply?.registrationNumber || "");
  const [status, setStatus] = useState<'active' | 'discontinued' | 'restricted'>(editingSupply?.status || 'active');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [newPest, setNewPest] = useState("");

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

  const handleAddPest = () => {
    if (newPest.trim() && !targetPests.includes(newPest.trim())) {
      setTargetPests([...targetPests, newPest.trim()]);
      setNewPest("");
    }
  };

  const handleRemovePest = (pest: string) => {
    setTargetPests(targetPests.filter(p => p !== pest));
  };

  const handleApplicationMethodChange = (method: ApplicationMethod) => {
    if (applicationMethods.includes(method)) {
      setApplicationMethods(applicationMethods.filter(m => m !== method));
    } else {
      setApplicationMethods([...applicationMethods, method]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre del insumo es obligatorio");
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

    if (!instructions.trim()) {
      toast.error("Las instrucciones de uso son obligatorias");
      return;
    }

    if (!recommendedDose.trim()) {
      toast.error("La dosis recomendada es obligatoria");
      return;
    }

    if (applicationMethods.length === 0) {
      toast.error("Debe seleccionar al menos un método de aplicación");
      return;
    }

    if (!safetyNotes.trim()) {
      toast.error("Las notas de seguridad son obligatorias");
      return;
    }

    const supplyData: Omit<SupplyDatabaseItem, "id" | "createdAt" | "updatedAt"> = {
      name: name.trim(),
      category,
      description: description.trim(),
      activeIngredient: activeIngredient.trim() || undefined,
      concentration: concentration.trim() || undefined,
      image,
      instructions: instructions.trim(),
      recommendedDose: recommendedDose.trim(),
      targetPests,
      applicationMethods,
      safetyNotes: safetyNotes.trim(),
      manufacturer: manufacturer.trim() || undefined,
      registrationNumber: registrationNumber.trim() || undefined,
      status,
      createdBy: "admin001" // En una implementación real, esto vendría del usuario actual
    };

    if (editingSupply) {
      updateSupply(editingSupply.id, supplyData);
    } else {
      addSupply(supplyData);
    }

    // Reset form
    setName("");
    setCategoryId("");
    setDescription("");
    setActiveIngredient("");
    setConcentration("");
    setImage("");
    setInstructions("");
    setRecommendedDose("");
    setTargetPests([]);
    setApplicationMethods([]);
    setSafetyNotes("");
    setManufacturer("");
    setRegistrationNumber("");
    setStatus('active');

    onSave?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {editingSupply ? "Editar Insumo" : "Nuevo Insumo"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Insumo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Fungicida XYZ"
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
              placeholder="Descripción detallada del producto..."
              rows={2}
            />
          </div>

          {/* Información técnica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activeIngredient">Ingrediente Activo</Label>
              <Input
                id="activeIngredient"
                value={activeIngredient}
                onChange={(e) => setActiveIngredient(e.target.value)}
                placeholder="Ej: Azoxistrobina"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concentration">Concentración</Label>
              <Input
                id="concentration"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                placeholder="Ej: 25% SC"
              />
            </div>
          </div>

          {/* Imagen del producto */}
          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
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
                  alt="Producto"
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

          {/* Dosis e Instrucciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recommendedDose">Dosis Recomendada *</Label>
              <Input
                id="recommendedDose"
                value={recommendedDose}
                onChange={(e) => setRecommendedDose(e.target.value)}
                placeholder="Ej: 1-2 ml/L"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado del Producto *</Label>
              <Select value={status} onValueChange={(value: 'active' | 'discontinued' | 'restricted') => setStatus(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="discontinued">Descontinuado</SelectItem>
                  <SelectItem value="restricted">Uso Restringido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plagas objetivo */}
          <div className="space-y-2">
            <Label htmlFor="targetPests">Plagas/Enfermedades Objetivo</Label>
            <div className="flex gap-2">
              <Input
                id="newPest"
                value={newPest}
                onChange={(e) => setNewPest(e.target.value)}
                placeholder="Ej: Moniliasis"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddPest}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Añadir
              </Button>
            </div>
            
            {targetPests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {targetPests.map((pest, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {pest}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemovePest(pest)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Métodos de aplicación */}
          <div className="space-y-2">
            <Label>Métodos de Aplicación *</Label>
            <div className="flex flex-wrap gap-2">
              {APPLICATION_METHODS.map((method) => (
                <Badge 
                  key={method}
                  variant={applicationMethods.includes(method) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleApplicationMethodChange(method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
            {applicationMethods.length === 0 && (
              <p className="text-xs text-red-500">Seleccione al menos un método de aplicación</p>
            )}
          </div>

          {/* Instrucciones */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instrucciones de Uso *</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instrucciones detalladas de aplicación, frecuencia, condiciones climáticas, etc..."
              rows={3}
              required
            />
          </div>

          {/* Información de seguridad */}
          <div className="space-y-2">
            <Label htmlFor="safetyNotes">Notas de Seguridad *</Label>
            <Textarea
              id="safetyNotes"
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              placeholder="Precauciones, equipo de protección requerido, periodo de reingreso, etc..."
              rows={3}
              required
            />
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input
                id="manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Ej: AgroQuímicos S.A."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Número de Registro</Label>
              <Input
                id="registrationNumber"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Ej: REG-001-AGR"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingSupply ? "Actualizar Insumo" : "Crear Insumo"}
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