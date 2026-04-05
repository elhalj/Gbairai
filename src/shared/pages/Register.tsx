import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    User as UserIcon,
    Mail,
    Lock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { RegisterData, randomAvatar, User } from '../types';
import { useAuth } from "../hooks/useAuth";
import { encryptData, hashPassword } from '../utils/crypto';

export function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState<RegisterData>({
        name: "",
        pseudo: "",
        secretCode: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error("Le nom est requis");
            setErrors("Le nom est requis");
            return false;
        }

        if (!formData.pseudo.trim()) {
            toast.error("Le pseudo est requis");
            setErrors("Le pseudo est requis");
            return false;
        }

        if (!formData.secretCode.trim()) {
            toast.error("Le code secret est requis");
            setErrors("Le code secret est requis");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("L'email est requis");
            setErrors("L'email est requis");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Veuillez entrer un email valide");
            setErrors("Veuillez entrer un email valide");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            setErrors("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            setErrors("Les mots de passe ne correspondent pas");
            return false;
        }

        return true;
    };

    

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simuler une inscription API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Crypter le mot de passe et le code secret
            const hashedPassword = hashPassword(formData.password);
            const encryptedSecretCode = encryptData(formData.secretCode);
            
            // Créer l'utilisateur avec les données cryptées
            const user = {
                id: Date.now().toString(),
                name: formData.name,
                pseudo: formData.pseudo,
                email: formData.email,
                avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomAvatar}`,
                bio: "",
                postsCount: 0,
                hashedPassword,
                encryptedSecretCode,
            };

            localStorage.setItem("user", JSON.stringify(user));

            // Utiliser le hook d'authentification
            const authUser: User = {
                id: user.id,
                name: user.name,
                pseudo: user.pseudo,
                email: user.email,
                avatar: user.avatar,
                bio: "",
                postsCount: 0,
                encryptedSecretCode: user.encryptedSecretCode
            };
            login(authUser);

            toast.success("Inscription réussie !");
            navigate("/profile");
        } catch (error) {
            toast.error("Erreur lors de l'inscription");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Bouton retour */}
                <Link to="/">
                    <Button variant="ghost" size="sm" className="mb-6">
                        <ArrowLeft className="size-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                </Link>

                {/* Carte d'inscription */}
                <Card className="p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Créer un compte
                        </h1>
                        <p className="text-gray-600">
                            Rejoignez la communauté GBAIRAI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nom */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Votre nom complet..."
                                    className="pl-10"
                                    required
                                />
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                            </div>
                        </div>

                        {/* Pseudo */}
                        <div className="space-y-2">
                            <Label htmlFor="pseudo">Pseudo</Label>
                            <Input
                                id="pseudo"
                                name="pseudo"
                                type="text"
                                value={formData.pseudo}
                                onChange={handleChange}
                                placeholder="Votre pseudo..."
                                required
                            />
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                        </div>

                        {/* Code secret */}
                        <div className="space-y-2">
                            <Label htmlFor="secretCode">Code secret</Label>
                            <Input
                                id="secretCode"
                                name="secretCode"
                                type="password"
                                value={formData.secretCode}
                                onChange={handleChange}
                                placeholder="Votre code secret..."
                                required
                            />
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre@email.com"
                                    className="pl-10"
                                    required
                                />
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 caractères"
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                            </div>
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirmer le mot de passe
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirmez votre mot de passe"
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                                {errors && <p className="p-2 border-1 border-red-300 rounded-sm">{ errors }</p>}
                            </div>
                        </div>

                        {/* Bouton d'inscription */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Inscription...
                                </>
                            ) : (
                                "Créer mon compte"
                            )}
                        </Button>
                    </form>

                    {/* Lien vers connexion */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    {/* Informations légales */}
                    <div className="mt-6 text-xs text-gray-500 text-center">
                        En vous inscrivant, vous acceptez nos{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            conditions d'utilisation
                        </a>{" "}
                        et notre{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            politique de confidentialité
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
}
