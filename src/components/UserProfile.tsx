import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera, 
  Upload, 
  X,
  Key
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function UserProfile() {
  const { currentUser, isAdmin } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState(currentUser?.name || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phoneNumber: ""
  });
  const [bio, setBio] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast.success("Perfil actualizado correctamente");
    setIsEditing(false);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          toast.success("Imagen de perfil actualizada");
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeProfileImage = () => {
    setProfileImage(null);
    toast.success("Imagen de perfil eliminada");
  };
  
  const handleChangePassword = () => {
    toast.success("Se ha enviado un enlace para cambiar la contraseña a su correo electrónico");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mi Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={currentUser?.name || "Usuario"} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                      {currentUser?.name ? getInitials(currentUser.name) : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="rounded-full h-8 w-8 p-0"
                      onClick={handleUploadClick}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    {profileImage && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="rounded-full h-8 w-8 p-0"
                        onClick={removeProfileImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-lg">{currentUser?.name}</h3>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <div className="flex justify-center mt-2">
                  <Badge className={cn(
                    "text-white",
                    isAdmin ? "bg-red-500" : "bg-blue-500"
                  )}>
                    {isAdmin ? "Administrador" : "Usuario"}
                  </Badge>
                </div>
              </div>
              
              {!isEditing && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
            
            {/* Profile Details */}
            <div className="flex-1">
              {isEditing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre y apellidos"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={currentUser?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Teléfono</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ej: +1234567890"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        value={currentUser?.department || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contacto de Emergencia</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Nombre"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                      />
                      <Input
                        placeholder="Relación"
                        value={emergencyContact.relationship}
                        onChange={(e) => setEmergencyContact({...emergencyContact, relationship: e.target.value})}
                      />
                      <Input
                        placeholder="Teléfono"
                        value={emergencyContact.phoneNumber}
                        onChange={(e) => setEmergencyContact({...emergencyContact, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Cuéntanos sobre ti..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      type="button" 
                      onClick={handleSaveProfile}
                      className="flex-1"
                    >
                      Guardar Cambios
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileInfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={currentUser?.email || ""} />
                    <ProfileInfoItem icon={<Building className="h-4 w-4" />} label="Departamento" value={currentUser?.department || "No especificado"} />
                    <ProfileInfoItem icon={<Briefcase className="h-4 w-4" />} label="Cargo" value={"No especificado"} />
                    <ProfileInfoItem icon={<Phone className="h-4 w-4" />} label="Teléfono" value={"No especificado"} />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Información de Cuenta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileInfoItem 
                        icon={<Calendar className="h-4 w-4" />} 
                        label="Fecha de Registro" 
                        value={currentUser?.createdAt ? format(new Date(currentUser.createdAt), "dd/MM/yyyy", { locale: es }) : "Desconocida"} 
                      />
                      <ProfileInfoItem 
                        icon={<Calendar className="h-4 w-4" />} 
                        label="Último Acceso" 
                        value={currentUser?.lastLogin ? format(new Date(currentUser.lastLogin), "dd/MM/yyyy HH:mm", { locale: es }) : "Desconocido"} 
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Seguridad</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleChangePassword}
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" />
              Información de Administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-700">
                Como administrador, tienes acceso a funcionalidades adicionales del sistema:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-1">Gestión de Usuarios</h3>
                  <p className="text-sm text-red-700">Crear, editar y administrar usuarios del sistema</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-1">Gestión de Ubicaciones</h3>
                  <p className="text-sm text-red-700">Administrar ubicaciones y tags RFID</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-1">Visualización de Datos</h3>
                  <p className="text-sm text-red-700">Acceso a dashboards y reportes completos</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-1">Configuración del Sistema</h3>
                  <p className="text-sm text-red-700">Modificar parámetros y ajustes globales</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-800 mb-1">Permisos Asignados</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {Object.entries(currentUser?.permissions || {})
                    .filter(([key, value]) => value === true)
                    .map(([key]) => (
                      <Badge key={key} variant="outline" className="bg-red-50 border-red-200 text-red-700">
                        {formatPermissionName(key)}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for profile info items
function ProfileInfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-gray-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

// Helper function to format permission names
function formatPermissionName(permission: string): string {
  // Remove the 'can' prefix and convert camelCase to spaces
  const withoutPrefix = permission.replace(/^can/, '');
  return withoutPrefix
    .replace(/([A-Z])/g, ' $1')
    .trim();
}