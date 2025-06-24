import { useState, useRef } from "react";
import { useTool } from "@/context/ToolContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Camera, Upload, X, Wrench } from "lucide-react";
import { TOOL_CATEGORIES, TOOL_CONDITIONS, ToolCategory, ToolCondition } from "@/types/tools";

export function ToolInput() {
  const { addToolRecord } = useTool();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ToolCategory | "">("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [assignedBy, setAssignedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [condition, setCondition] = useState<ToolCondition | "">("");
  const [maintenanceInstructions, setMaintenanceInstructions] = useState("");
  const [safetyInstructions, setSafetyInstructions] = useState("");
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiration, setWarrantyExpiration] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre de la herramienta es obligatorio");
      return;
    }

    if (!category) {
      toast.error("Por favor seleccione una categoría");
      return;
    }

    if (!assignedBy.trim()) {
      toast.error("El técnico asignador es obligatorio");
      return;
    }

    if (!assignedTo.trim()) {
      toast.error("La persona asignada es obligatoria");
      return;
    }

    if (!condition) {
      toast.error("Por favor seleccione el estado de la herramienta");
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

    addToolRecord({
      name: name.trim(),
      category,
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim(),
      description: description.trim(),
      image,
      assignedBy: assignedBy.trim(),
      assignedTo: assignedTo.trim(),
      condition,
      maintenanceInstructions: maintenanceInstructions.trim(),
      safetyInstructions: safetyInstructions.trim(),
      lastMaintenanceDate: lastMaintenanceDate,
      nextMaintenanceDate: nextMaintenanceDate,
      purchaseDate: purchaseDate,
      warrantyExpiration: warrantyExpiration,
      location: location.trim(),
      notes: notes.trim(),
    });

    // Reset form
    setName("");
    setCategory("");
    setBrand("");
    setModel("");
    setSerialNumber("");
    setDescription("");
    setImage("");
    setAssignedBy("");
    setAssignedTo("");
    setCondition("");
    setMaintenanceInstructions("");
    setSafetyInstructions("");
    setLastMaintenanceDate("");
    setNextMaintenanceDate("");
    setPurchaseDate("");
    setWarrantyExpiration("");
    setLocation("");
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Asignar Nueva Herramienta
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
                placeholder="Ej: Tijeras de podar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ToolCategory)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
              placeholder="Descripción de la herramienta y su uso..."
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
                placeholder="Ej: P68"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Serie</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ej: SN123456"
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

          {/* Asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedBy">Técnico Asignador *</Label>
              <Input
                id="assignedBy"
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                placeholder="Nombre del técnico"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Asignado a *</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Nombre de la persona"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Estado de la Herramienta *</Label>
              <Select value={condition} onValueChange={(value) => setCondition(value as ToolCondition)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_CONDITIONS.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación de Uso</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Invernadero A, Campo 1"
              />
            </div>
          </div>

          {/* Instrucciones */}
          <div className="space-y-2">
            <Label htmlFor="maintenanceInstructions">Instrucciones de Mantenimiento *</Label>
            <Textarea
              id="maintenanceInstructions"
              value={maintenanceInstructions}
              onChange={(e) => setMaintenanceInstructions(e.target.value)}
              placeholder="Instrucciones detalladas de mantenimiento, limpieza, lubricación, etc..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="safetyInstructions">Instrucciones de Seguridad *</Label>
            <Textarea
              id="safetyInstructions"
              value={safetyInstructions}
              onChange={(e) => setSafetyInstructions(e.target.value)}
              placeholder="Precauciones de seguridad, equipo de protección requerido, etc..."
              rows={3}
              required
            />
          </div>

          {/* Fechas importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastMaintenanceDate">Último Mantenimiento</Label>
              <Input
                id="lastMaintenanceDate"
                type="date"
                value={lastMaintenanceDate}
                onChange={(e) => setLastMaintenanceDate(e.target.value)}
              />
            </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observaciones Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cualquier observación adicional sobre la herramienta..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full bg-green-medium hover:bg-green-dark">
            Asignar Herramienta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}