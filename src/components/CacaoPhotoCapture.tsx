
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CacaoPhotoCaptureProps {
  onPhotosChange: (photos: string[]) => void;
  photos: string[];
}

export function CacaoPhotoCapture({ onPhotosChange, photos }: CacaoPhotoCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Preferir cámara trasera
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
        
        const updatedPhotos = [...photos, photoData];
        onPhotosChange(updatedPhotos);
        
        toast.success("Foto capturada correctamente");
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const updatedPhotos = [...photos, e.target.result as string];
              onPhotosChange(updatedPhotos);
            }
          };
          reader.readAsDataURL(file);
        }
      });
      toast.success(`${files.length} foto(s) añadida(s)`);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(updatedPhotos);
    toast.success("Foto eliminada");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotografías de Evidencia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera controls */}
        <div className="flex gap-2 flex-wrap">
          {!isCapturing ? (
            <>
              <Button onClick={startCamera} variant="outline" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Tomar Foto
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir Archivo
              </Button>
            </>
          ) : (
            <>
              <Button onClick={capturePhoto} className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Capturar
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Cancelar
              </Button>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Camera view */}
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

        {/* Photos gallery */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Fotos capturadas ({photos.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Evidencia ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No hay fotos capturadas aún
          </div>
        )}
      </CardContent>
    </Card>
  );
}
