import { useState, useRef } from "react";
import { useSupply } from "@/context/SupplyContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Camera, Upload, X } from "lucide-react";
import { SUPPLY_CATEGORIES, APPLICATION_METHODS, SupplyCategory, ApplicationMethod } from "@/types/supplies";

export function SupplyInput() {
  const { addSupplyRecord } = useSupply();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SupplyCategory | "">("");
  const [description, setDescription] = useState("");
  const [activeIngredient, setActiveIngredient] = useState("");
  const [concentration, setConcentration] = useState("");
  const [image, setImage] = useState<string>("");
  const [instructions, setInstructions] = useState("");
  const [assignedDose, setAssignedDose] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [targetPest, setTargetPest] = useState("");
  const [applicationMethod, setApplicationMethod] = useState<ApplicationMethod | "">("");
  const [safetyNotes, setSafetyNotes] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [supplier, setSupplier] = useState("");
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
      toast.error("El nombre del insumo es obligatorio");
      return;
    }

    if (!category) {
      toast.error("Por favor seleccione una categoría");
      return;
    }

    if (!assignedDose.trim()) {
      toast.error("La dosis asignada es obligatoria");
      return;
    }

    if (!assignedBy.trim()) {
      toast.error("El técnico asignador es obligatorio");
      return;
    }

    if (!applicationMethod) {
      toast.error("Por favor seleccione el método de aplicación");
      return;
    }

    if (!instructions.trim()) {
      toast.error("Las instrucciones de uso son obligatorias");
      return;
    }

    addSupplyRecord({
      name: name.trim(),
      category,
      description: description.trim(),
      activeIngredient: activeIngredient.trim(),
      concentration: concentration.trim(),
      image,
      instructions: instructions.trim(),
      assignedDose: assignedDose.trim(),
      assignedBy: assignedBy.trim(),
      targetPest: targetPest.trim(),
      applicationMethod,
      safetyNotes: safetyNotes.trim(),
      expirationDate: expirationDate,
      batchNumber: batchNumber.trim(),
      supplier: supplier.trim(),
      notes: notes.trim(),
    });

    // Reset form
    setName("");
    setCategory("");
    setDescription("");
    setActiveIngredient("");
    setConcentration("");
    setImage("");
    setInstructions("");
    setAssignedDose("");
    setAssignedBy("");
    setTargetPest("");
    setApplicationMethod("");
    setSafetyNotes("");
    setExpirationDate("");
    setBatchNumber("");
    setSupplier("");
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Nuevo Insumo</CardTitle>
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
              <Select value={category} onValueChange={(value) => setCategory(value as SupplyCategory)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLY_CATEGORIES.map((cat) => (
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
              placeholder="Descripción del producto..."
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
                placeholder="Ej: Mancozeb"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concentration">Concentración</Label>
              <Input
                id="concentration"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                placeholder="Ej: 80% WP"
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

          {/* Asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDose">Dosis Asignada *</Label>
              <Input
                id="assignedDose"
                value={assignedDose}
                onChange={(e) => setAssignedDose(e.target.value)}
                placeholder="Ej: 2.5 g/L"
                required
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetPest">Plaga/Enfermedad Objetivo</Label>
              <Input
                id="targetPest"
                value={targetPest}
                onChange={(e) => setTargetPest(e.target.value)}
                placeholder="Ej: Antracnosis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationMethod">Método de Aplicación *</Label>
              <Select value={applicationMethod} onValueChange={(value) => setApplicationMethod(value as ApplicationMethod)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el método" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instrucciones de Uso *</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instrucciones detalladas de aplicación, frecuencia, condiciones climáticas, etc..."
              rows={4}
              required
            />
          </div>

          {/* Información adicional */}
          <div className="space-y-2">
            <Label htmlFor="safetyNotes">Notas de Seguridad</Label>
            <Textarea
              id="safetyNotes"
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              placeholder="Precauciones, equipo de protección requerido, etc..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Fecha de Vencimiento</Label>
              <Input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchNumber">Número de Lote</Label>
              <Input
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Ej: L2024001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observaciones Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cualquier observación adicional..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full bg-green-medium hover:bg-green-dark">
            Asignar Insumo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}