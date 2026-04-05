import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { toast } from "sonner";
import { LoginData } from "../types";
import { useAuth } from "../hooks/useAuth";
import { checkSecretCodeInPosts } from "../utils/checkSecretCode";
import { usePosts } from "@/features/posts/hooks/usePosts";

// Fonction pour vérifier si l'utilisateur existe dans les posts
const checkUserInPosts = (
    posts: any[],
    pseudo: string,
    secretCode: string,
): boolean => {
    return posts.some(
        (post: any) =>
            (post.author && post.author.name === pseudo) ||
            (post.content && post.content.includes(secretCode)) ||
            (post.title && post.title.includes(secretCode)),
    );
};

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { getAllPosts } = usePosts({ page: 1, limit: 100 });

    const [formData, setFormData] = useState<LoginData>({
        email: "",
        pseudo: "",
        secretCode: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            toast.error("L'email est requis");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Veuillez entrer un email valide");
            return false;
        }

        if (!formData.pseudo.trim()) {
            toast.error("Le pseudo est requis");
            return false;
        }

        if (!formData.secretCode.trim()) {
            toast.error("Le code secret est requis");
            return false;
        }

        // Le mot de passe est optionnel pour cette démo basée sur les posts
        return true;
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simuler une connexion API
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Attendre que les posts soient chargés
            if (getAllPosts.isLoading) {
                toast.error(
                    "Chargement des posts en cours, veuillez réessayer",
                );
                setIsLoading(false);
                return;
            }

            const posts = getAllPosts.data?.posts || [];

            // Vérifier si l'utilisateur existe dans les posts
            if (
                !checkUserInPosts(posts, formData.pseudo, formData.secretCode)
            ) {
                toast.error(
                    "Aucun utilisateur trouvé avec ce pseudo et code secret dans les posts",
                );
                setIsLoading(false);
                return;
            }

            // Vérifier si le secretCode existe dans les posts
            if (!checkSecretCodeInPosts(formData.secretCode, posts)) {
                toast.error("Code secret non trouvé dans les posts");
                setIsLoading(false);
                return;
            }

            // Filtrer les posts de l'utilisateur
            const userPosts = posts.filter(
                (post: any) =>
                    (post.author && post.author.name === formData.pseudo) ||
                    (post.content &&
                        post.content.includes(formData.secretCode)),
            );

            // Générer un ID utilisateur basé sur le pseudo
            const userId = `user_${formData.pseudo.toLowerCase().replace(/\s+/g, "_")}`;

            // Créer un avatar aléatoire
            const avatarSeed = formData.pseudo
                .toLowerCase()
                .replace(/\s+/g, "");
            const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

            // Utiliser le hook d'authentification
            login({
                id: userId,
                name: formData.pseudo,
                email: formData.email,
                pseudo: formData.pseudo,
                avatar: avatar,
                bio: "",
                postsCount: userPosts.length,
                encryptedSecretCode: formData.secretCode, // Le secretCode n'est pas stocké encrypté pour cette démo
            });

            toast.success("Connexion réussie !");
            navigate("/profile");
        } catch (error) {
            toast.error("Erreur lors de la connexion");
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

                {/* Carte de connexion */}
                <Card className="p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Connexion
                        </h1>
                        <p className="text-gray-600">
                            Accédez à votre espace GBAIRAI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Votre pseudo"
                                required
                            />
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
                                placeholder="Votre code secret"
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">
                                    Mot de passe (optionnel)
                                </Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Votre mot de passe (optionnel)"
                                    className="pl-10 pr-10"
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
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </form>

                    {/* Lien vers inscription */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>

                    {/* Séparateur */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Ou
                            </span>
                        </div>
                    </div>

                    {/* Connexion rapide (démo) */}
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 text-center mb-2">
                            Compte de démonstration :
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                                setFormData({
                                    email: "demo@gbairai.com",
                                    pseudo: "demo_user",
                                    secretCode: "demo123",
                                    password: "demo123",
                                });
                                toast.info("Identifiants de démo pré-remplis");
                            }}
                        >
                            Utiliser le compte démo
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
