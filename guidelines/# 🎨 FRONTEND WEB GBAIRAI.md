# 🎨 FRONTEND WEB GBAIRAI - Programme d'exercices complet

---

## 📅 SEMAINE 1 : Setup & Fondations React

### Jour 1 : Installation et premier composant (3-4h)

**Exercice 1.1 - Setup Next.js (45min)**

```bash
# À faire :
1. npx create-next-app@latest gbairai-web
   - TypeScript? No (pour débuter)
   - ESLint? Yes
   - Tailwind CSS? Yes
   - src/ directory? Yes
   - App Router? Yes
   - Import alias? Yes (@/*)

2. cd gbairai-web
3. npm run dev
4. Ouvrir http://localhost:3000
5. Explorer la structure du projet
```

**Exercice 1.2 - Structure du projet (1h)**

```
gbairai-web/
├── src/
│   ├── app/
│   │   ├── layout.js          # Layout principal
│   │   ├── page.js             # Page d'accueil
│   │   └── globals.css         # Styles globaux
│   ├── components/
│   │   ├── layout/
│   │   ├── common/
│   │   └── features/
│   ├── lib/
│   │   ├── axios.js
│   │   └── utils.js
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── constants/
├── public/
│   └── images/
├── .env.local
└── package.json

# Créer cette structure manuellement
```

**Exercice 1.3 - Variables d'environnement (30min)**

```bash
# Créer .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Gbairai
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton_cloud_name

# Créer .env.example (sans valeurs sensibles)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=
```

**Exercice 1.4 - Configuration Axios (1h)**

```javascript
// À créer : src/lib/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers login si non autorisé
      localStorage.removeItem("token");
      window.location.href = "/connexion";
    }
    return Promise.reject(error);
  },
);

export default api;
```

**Exercice 1.5 - Premiers composants (1h)**

```javascript
// À créer : src/components/common/Button.jsx

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles = "font-medium rounded-lg transition-colors";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Tester dans page.js
```

**✅ Checkpoint Jour 1** : Projet Next.js configuré, Axios setup, premiers composants

---

### Jour 2 : Layout et Navigation (4h)

**Exercice 2.1 - Header/Navbar (2h)**

```javascript
// À créer : src/components/layout/Header.jsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Catégories", href: "/categories" },
    { label: "À propos", href: "/a-propos" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Gbairai</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } pb-1 transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/articles/nouveau"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Publier
            </Link>
            <Link
              href="/connexion"
              className="text-gray-700 hover:text-blue-600"
            >
              Connexion
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
```

**Exercice 2.2 - Footer (1h)**

```javascript
// À créer : src/components/layout/Footer.jsx

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Gbairai</h3>
            <p className="text-gray-400 text-sm">
              La plateforme de journalisme citoyen qui donne la voix à tous.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/articles" className="hover:text-white">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/mentions-legales" className="hover:text-white">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-white">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-white">
                  CGU
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              {/* Icônes réseaux sociaux - à ajouter */}
              <a href="#" className="text-gray-400 hover:text-white">
                FB
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                TW
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {currentYear} Gbairai. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
```

**Exercice 2.3 - Layout principal (1h)**

```javascript
// Modifier : src/app/layout.js

import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Gbairai - Journalisme Citoyen",
  description: "Plateforme de partage d'informations citoyennes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**✅ Checkpoint Jour 2** : Layout complet avec Header et Footer responsive

---

### Jour 3-4 : Composants réutilisables (8h)

**Exercice 3.1 - Input Component (1h30)**

```javascript
// À créer : src/components/common/Input.jsx

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500" : "border-gray-300"}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

**Exercice 3.2 - Textarea Component (1h)**

```javascript
// À créer : src/components/common/Textarea.jsx

export default function Textarea({
  label,
  error,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

**Exercice 3.3 - Select Component (1h)**

```javascript
// À créer : src/components/common/Select.jsx

export default function Select({
  label,
  options,
  error,
  placeholder = "Sélectionner...",
  className = "",
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

**Exercice 3.4 - Card Component (1h)**

```javascript
// À créer : src/components/common/Card.jsx

export default function Card({
  children,
  className = "",
  padding = true,
  hover = false,
}) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md
        ${padding ? "p-6" : ""}
        ${hover ? "hover:shadow-lg transition-shadow cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

**Exercice 3.5 - Badge Component (45min)**

```javascript
// À créer : src/components/common/Badge.jsx

export default function Badge({ children, variant = "default", size = "md" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}
```

**Exercice 3.6 - Loading Spinner (45min)**

```javascript
// À créer : src/components/common/Spinner.jsx

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          border-4 border-gray-200 border-t-blue-600
          rounded-full animate-spin
        `}
      />
    </div>
  );
}

// Version pleine page
export function LoadingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}
```

**Exercice 3.7 - Alert Component (1h)**

```javascript
// À créer : src/components/common/Alert.jsx

export default function Alert({
  type = "info",
  children,
  onClose,
  className = "",
}) {
  const types = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-800",
      icon: "💡",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-800",
      icon: "✓",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-800",
      icon: "⚠",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-800",
      icon: "✕",
    },
  };

  const config = types[type];

  return (
    <div
      className={`
        ${config.bg} ${config.text} ${config.border}
        border-l-4 p-4 rounded-r-lg
        flex items-start justify-between
        ${className}
      `}
    >
      <div className="flex items-start">
        <span className="text-xl mr-3">{config.icon}</span>
        <div>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      )}
    </div>
  );
}
```

**Exercice 3.8 - Modal Component (1h30)**

```javascript
// À créer : src/components/common/Modal.jsx

"use client";

import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-lg shadow-xl
            w-full ${sizes[size]}
            transform transition-all
          `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

**✅ Checkpoint Jour 3-4** : Bibliothèque complète de composants réutilisables

---

### Jour 5 : Custom Hooks (4h)

**Exercice 4.1 - useAuth Hook (1h30)**

```javascript
// À créer : src/hooks/useAuth.js

"use client";

import { useState, useEffect, createContext, useContext } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/");
  };

  const register = async (nom, email, password) => {
    const { data } = await api.post("/auth/register", { nom, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/connexion");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Exercice 4.2 - useForm Hook (1h)**

```javascript
// À créer : src/hooks/useForm.js

"use client";

import { useState } from "react";

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Valider le champ si déjà touché
    if (touched[name] && validate) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors({ ...errors, [name]: fieldErrors[name] });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    // Valider le champ
    if (validate) {
      const fieldErrors = validate(values);
      setErrors({ ...errors, [name]: fieldErrors[name] });
    }
  };

  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault();

      // Marquer tous les champs comme touchés
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Valider
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
```

**Exercice 4.3 - useDebounce Hook (45min)**

```javascript
// À créer : src/hooks/useDebounce.js

"use client";

import { useState, useEffect } from "react";

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Exercice 4.4 - useToast Hook (45min)**

```javascript
// À créer : src/hooks/useToast.js

"use client";

import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => {
      return addToast(message, "success", duration);
    },
    [addToast],
  );

  const error = useCallback(
    (message, duration) => {
      return addToast(message, "error", duration);
    },
    [addToast],
  );

  const info = useCallback(
    (message, duration) => {
      return addToast(message, "info", duration);
    },
    [addToast],
  );

  const warning = useCallback(
    (message, duration) => {
      return addToast(message, "warning", duration);
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}

// Composant Toast pour affichage
// À créer : src/components/common/ToastContainer.jsx
("use client");

import { useToast } from "@/hooks/useToast";
import Alert from "./Alert";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        >
          {toast.message}
        </Alert>
      ))}
    </div>
  );
}
```

**✅ Checkpoint Jour 5** : Hooks personnalisés pour gérer auth, formulaires, debounce, toasts

---

## 📅 SEMAINE 2 : Authentification & Profil

### Jour 6-7 : Pages d'authentification (8h)

**Exercice 5.1 - Page de connexion (2h)**

```javascript
// À créer : src/app/connexion/page.js

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import Link from "next/link";

export default function ConnexionPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email invalide";
    }
    if (!values.password) {
      errors.password = "Mot de passe requis";
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ email: "", password: "" }, validate);

  const onSubmit = async (values) => {
    try {
      setError("");
      await login(values.email, values.password);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Connexion à Gbairai
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/inscription"
              className="text-blue-600 hover:text-blue-500"
            >
              créer un compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            placeholder="votreemail@exemple.com"
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label>
            </div>

            <Link
              href="/mot-de-passe-oublie"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**Exercice 5.2 - Page d'inscription (2h30)**

```javascript
// À créer : src/app/inscription/page.js

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import Link from "next/link";

export default function InscriptionPage() {
  const { register } = useAuth();
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};

    if (!values.nom) {
      errors.nom = "Nom requis";
    } else if (values.nom.length < 2) {
      errors.nom = "Minimum 2 caractères";
    }

    if (!values.email) {
      errors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email invalide";
    }

    if (!values.password) {
      errors.password = "Mot de passe requis";
    } else if (values.password.length < 6) {
      errors.password = "Minimum 6 caractères";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(values.password)) {
      errors.password = "Doit contenir majuscule, minuscule et chiffre";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirmation requise";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!values.acceptTerms) {
      errors.acceptTerms = "Vous devez accepter les CGU";
    }

    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      nom: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validate,
  );

  const onSubmit = async (values) => {
    try {
      setError("");
      await register(values.nom, values.email, values.password);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/connexion"
              className="text-blue-600 hover:text-blue-500"
            >
              se connecter
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="Nom complet"
            name="nom"
            value={values.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.nom && errors.nom}
            placeholder="Jean Dupont"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            placeholder="jean@exemple.com"
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            placeholder="••••••••"
          />

          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
            placeholder="••••••••"
          />

          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={values.acceptTerms}
              onChange={(e) =>
                handleChange({
                  target: { name: "acceptTerms", value: e.target.checked },
                })
              }
              onBlur={handleBlur}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="acceptTerms"
              className="ml-2 block text-sm text-gray-900"
            >
              J'accepte les{" "}
              <Link href="/cgu" className="text-blue-600 hover:text-blue-500">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href="/confidentialite"
                className="text-blue-600 hover:text-blue-500"
              >
                politique de confidentialité
              </Link>
            </label>
          </div>
          {touched.acceptTerms && errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**Exercice 5.3 - Mot de passe oublié (1h30)**

```javascript
// À créer : src/app/mot-de-passe-oublie/page.js

"use client";

import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import api from "@/lib/axios";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import Link from "next/link";

export default function MotDePasseOubliePage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email invalide";
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ email: "" }, validate);

  const onSubmit = async (values) => {
    try {
      setError("");
      await api.post("/auth/forgot-password", values);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {success ? (
          <Alert type="success">
            Email envoyé ! Vérifiez votre boîte de réception.
          </Alert>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert type="error">{error}</Alert>}

            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder="votreemail@exemple.com"
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer le lien"}
            </Button>

            <div className="text-center">
              <Link
                href="/connexion"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

**Exercice 5.4 - Réinitialisation mot de passe (2h)**

```javascript
// À créer : src/app/reset-password/[token]/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@/hooks/useForm";
import api from "@/lib/axios";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = "Mot de passe requis";
    } else if (values.password.length < 6) {
      errors.password = "Minimum 6 caractères";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirmation requise";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ password: "", confirmPassword: "" }, validate);

  const onSubmit = async (values) => {
    try {
      setError("");
      await api.post(`/auth/reset-password/${params.token}`, {
        password: values.password,
      });
      router.push("/connexion?reset=success");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la réinitialisation",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert type="error">{error}</Alert>}

          <Input
            label="Nouveau mot de passe"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            placeholder="••••••••"
          />

          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Réinitialisation..." : "Réinitialiser"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**✅ Checkpoint Jour 6-7** : Système d'authentification complet (connexion, inscription, mot de passe oublié)

---

### Jour 8-9 : Page de profil (8h)

**Exercice 6.1 - Affichage profil (3h)**

```javascript
// À créer : src/app/profil/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { LoadingPage } from "@/components/common/Spinner";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("articles");

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const [userRes, articlesRes, statsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/articles/auteur/${id}`),
        isOwnProfile ? api.get("/stats/me") : Promise.resolve({ data: null }),
      ]);

      setUser(userRes.data.user);
      setArticles(articlesRes.data.data);
      setStats(statsRes.data?.data);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profil */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.nom}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.nom}</h1>
            <p className="text-gray-600 mt-1">
              @{user.nom.toLowerCase().replace(" ", "")}
            </p>

            {user.bio && <p className="mt-4 text-gray-700">{user.bio}</p>}

            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <Badge variant="primary">{user.role}</Badge>
              <Badge>
                Membre depuis {new Date(user.createdAt).getFullYear()}
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalArticles || articles.length}
                </div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalVues || 0}
                </div>
                <div className="text-sm text-gray-600">Vues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalLikes || 0}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div>
              <Button href="/profil/modifier">Modifier le profil</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {["articles", "favoris"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun article pour le moment
        </div>
      )}
    </div>
  );
}

// Composant ArticleCard à créer séparément
```

**Exercice 6.2 - Modifier le profil (3h)**

```javascript
// À créer : src/app/profil/modifier/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import api from "@/lib/axios";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Alert from "@/components/common/Alert";

export default function ModifierProfilPage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.nom || values.nom.length < 2) {
      errors.nom = "Minimum 2 caractères";
    }
    if (values.bio && values.bio.length > 500) {
      errors.bio = "Maximum 500 caractères";
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({ nom: "", bio: "" }, validate);

  useEffect(() => {
    if (user) {
      setValues({
        nom: user.nom || "",
        bio: user.bio || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarPreview(data.data.url);
    } catch (err) {
      setError("Erreur lors de l'upload de l'avatar");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess("");

      const updateData = { ...values };
      if (avatarPreview !== user.avatar) {
        updateData.avatar = avatarPreview;
      }

      await api.put(`/users/${user.id}`, updateData);
      await checkAuth(); // Rafraîchir les données user
      setSuccess("Profil mis à jour avec succès");

      setTimeout(() => {
        router.push(`/profil/${user.id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Modifier le profil
      </h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && <Alert type="success">{success}</Alert>}
          {error && <Alert type="error">{error}</Alert>}

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil
            </label>
            <div className="flex items-center gap-6">
              <img
                src={avatarPreview || "/default-avatar.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {uploading ? "Upload..." : "Changer la photo"}
                </label>
              </div>
            </div>
          </div>

          <Input
            label="Nom complet"
            name="nom"
            value={values.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.nom && errors.nom}
          />

          <Textarea
            label="Bio"
            name="bio"
            rows={4}
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bio && errors.bio}
            placeholder="Parlez-nous de vous..."
          />

          <div className="text-sm text-gray-500">
            {values.bio.length}/500 caractères
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>

      {/* Section Mot de passe */}
      <Card className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
        {/* Formulaire changement mot de passe - à implémenter */}
        <Button variant="secondary">Modifier le mot de passe</Button>
      </Card>
    </div>
  );
}
```

**Exercice 6.3 - Composant ArticleCard réutilisable (2h)**

```javascript
// À créer : src/components/features/ArticleCard.jsx

import Link from "next/link";
import Badge from "@/components/common/Badge";

export default function ArticleCard({ article }) {
  const imagePrincipale =
    article.images?.find((img) => img.isPrincipal) || article.images?.[0];

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        {imagePrincipale && (
          <div className="relative h-48 bg-gray-200">
            <img
              src={imagePrincipale.url}
              alt={article.titre}
              className="w-full h-full object-cover"
            />
            {article.categorie && (
              <div className="absolute top-4 left-4">
                <Badge variant="primary">{article.categorie.nom}</Badge>
              </div>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.titre}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {article.resume}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-2">
              <img
                src={article.auteur?.avatar || "/default-avatar.png"}
                alt={article.auteur?.nom}
                className="w-6 h-6 rounded-full"
              />
              <span>{article.auteur?.nom}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">👁️ {article.vues}</span>
              <span className="flex items-center gap-1">
                ❤️ {article.nombreLikes}
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            {new Date(
              article.datePublication || article.createdAt,
            ).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

**✅ Checkpoint Jour 8-9** : Profil utilisateur complet (affichage et modification)

---

## 📅 SEMAINE 3 : Articles - Affichage & Listing

### Jour 10-11 : Page d'accueil (8h)

**Exercice 7.1 - Hero Section (2h)**

```javascript
// À créer : src/components/features/HeroSection.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Bienvenue sur Gbairai
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            La plateforme de journalisme citoyen qui donne la voix à tous
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Button type="submit" size="lg" variant="secondary">
                Rechercher
              </Button>
            </div>
          </form>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/articles/nouveau" size="lg">
              📝 Publier un article
            </Button>
            <Button href="/articles" size="lg" variant="secondary">
              📚 Découvrir les articles
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffff"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
```

**Exercice 7.2 - Section catégories (2h)**

```javascript
// À créer : src/components/features/CategoriesSection.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Card from "@/components/common/Card";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (icone) => {
    const icons = {
      sports: "⚽",
      communaute: "👥",
      ecole: "🎓",
      politique: "🏛️",
      culture: "🎭",
    };
    return icons[icone] || "📰";
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explorer par catégorie
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Card
                hover
                className="text-center transition-transform hover:scale-105"
              >
                <div
                  className="text-4xl mb-3"
                  style={{ color: category.couleur }}
                >
                  {getIcon(category.icone)}
                </div>
                <h3 className="font-semibold text-gray-900">{category.nom}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Exercice 7.3 - Articles récents (2h)**

```javascript
// À créer : src/components/features/RecentArticlesSection.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import ArticleCard from "@/components/features/ArticleCard";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

export default function RecentArticlesSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/articles?limit=6&sort=recent");
      setArticles(data.data);
    } catch (error) {
      console.error("Erreur chargement articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Articles récents</h2>
          <Link href="/articles">
            <Button variant="secondary">Voir tout →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Exercice 7.4 - Page d'accueil complète (2h)**

```javascript
// Modifier : src/app/page.js

import HeroSection from "@/components/features/HeroSection";
import CategoriesSection from "@/components/features/CategoriesSection";
import RecentArticlesSection from "@/components/features/RecentArticlesSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <RecentArticlesSection />

      {/* Section stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Articles publiés</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Auteurs actifs</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Lecteurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA final */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à partager votre histoire ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez notre communauté de journalistes citoyens et faites
            entendre votre voix.
          </p>
          <Button href="/inscription" size="lg">
            Commencer gratuitement
          </Button>
        </div>
      </section>
    </div>
  );
}
```

**✅ Checkpoint Jour 10-11** : Page d'accueil complète et attrayante

---

### Jour 12-13 : Listing et filtres d'articles (8h)

**Exercice 8.1 - Filtres et recherche (3h)**

```javascript
// À créer : src/components/features/ArticleFilters.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useDebounce } from "@/hooks/useDebounce";

export default function ArticleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categorie: searchParams.get("categorie") || "",
    sort: searchParams.get("sort") || "recent",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters.categorie, filters.sort]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(
        data.data.map((cat) => ({
          value: cat._id,
          label: cat.nom,
        })),
      );
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.categorie) params.set("categorie", filters.categorie);
    if (filters.sort) params.set("sort", filters.sort);

    const queryString = params.toString();
    router.push(`/articles${queryString ? `?${queryString}` : ""}`);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categorie: "",
      sort: "recent",
    });
    router.push("/articles");
  };

  const hasActiveFilters =
    filters.search || filters.categorie || filters.sort !== "recent";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="md:col-span-2">
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Catégorie */}
        <Select
          placeholder="Catégorie"
          options={categories}
          value={filters.categorie}
          onChange={(e) =>
            setFilters({ ...filters, categorie: e.target.value })
          }
        />

        {/* Tri */}
        <Select
          placeholder="Trier par"
          options={[
            { value: "recent", label: "Plus récents" },
            { value: "populaire", label: "Plus populaires" },
            { value: "vues", label: "Plus vus" },
          ]}
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
```

**Exercice 8.2 - Liste d'articles avec pagination (3h)**

```javascript
// À créer : src/app/articles/page.js

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ArticleCard from "@/components/features/ArticleCard";
import ArticleFilters from "@/components/features/ArticleFilters";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchArticles();
  }, [searchParams]);

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set("page", page);
      params.set("limit", pagination.limit);

      const { data } = await api.get(`/articles?${params.toString()}`);

      setArticles(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erreur chargement articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchArticles(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tous les articles
        </h1>

        <ArticleFilters />

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="secondary"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Précédent
                    </Button>

                    <div className="flex gap-2">
                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`
                            px-4 py-2 rounded-lg font-medium
                            ${
                              page === pagination.page
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }
                          `}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="secondary"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun article trouvé</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

**Exercice 8.3 - Page catégorie (2h)**

```javascript
// À créer : src/app/categories/[slug]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ArticleCard from "@/components/features/ArticleCard";
import { LoadingPage } from "@/components/common/Spinner";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      const [catRes, articlesRes] = await Promise.all([
        api.get(`/categories/${slug}`),
        api.get(`/articles?categorie=${slug}`),
      ]);

      setCategory(catRes.data.data);
      setArticles(articlesRes.data.data);
    } catch (error) {
      console.error("Erreur chargement catégorie:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!category) return <div>Catégorie introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header catégorie */}
        <div
          className="rounded-lg p-8 mb-8 text-white"
          style={{ backgroundColor: category.couleur }}
        >
          <h1 className="text-4xl font-bold mb-2">{category.nom}</h1>
          <p className="text-xl opacity-90">{category.description}</p>
        </div>

        {/* Articles */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucun article dans cette catégorie pour le moment
          </div>
        )}
      </div>
    </div>
  );
}
```

**✅ Checkpoint Jour 12-13** : Listing complet avec filtres, recherche, pagination

---

# 🎨 FRONTEND WEB GBAIRAI - Suite (Jours 14-30)

---

## 📅 SEMAINE 4 : Détail Article & Création

### Jour 14-15 : Page de détail d'article (8h)

**Exercice 9.1 - Structure de la page détail (3h)**

```javascript
// À créer : src/app/articles/[slug]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { LoadingPage } from "@/components/common/Spinner";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data } = await api.get(`/articles/${slug}`);
      setArticle(data.data);

      // Vérifier si user a liké/favorisé
      if (user) {
        setLiked(data.data.likes.includes(user.id));
        // Check favoris depuis user data
      }
    } catch (error) {
      console.error("Erreur chargement article:", error);
      router.push("/articles");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push("/connexion");
      return;
    }

    try {
      const { data } = await api.post(`/articles/${article._id}/like`);
      setLiked(data.liked);
      setArticle({
        ...article,
        nombreLikes: data.likes,
      });
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      router.push("/connexion");
      return;
    }

    try {
      const { data } = await api.post(`/articles/${article._id}/favoris`);
      setFavorited(data.isFavorite);
    } catch (error) {
      console.error("Erreur favoris:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.titre,
        text: article.resume,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  if (loading) return <LoadingPage />;
  if (!article) return null;

  const imagePrincipale =
    article.images?.find((img) => img.isPrincipal) || article.images?.[0];
  const isAuthor = user?.id === article.auteur._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image principale */}
      {imagePrincipale && (
        <div className="relative h-96 bg-gray-900">
          <img
            src={imagePrincipale.url}
            alt={article.titre}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Statut badge pour l'auteur */}
        {isAuthor && article.statut !== "publie" && (
          <Alert type="warning" className="mb-4">
            Cet article est en statut : <strong>{article.statut}</strong>
          </Alert>
        )}

        {/* Contenu principal */}
        <article className="bg-white rounded-lg shadow-xl p-8 mb-8">
          {/* Catégorie */}
          <Link href={`/categories/${article.categorie.slug}`}>
            <Badge variant="primary" size="lg">
              {article.categorie.nom}
            </Badge>
          </Link>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            {article.titre}
          </h1>

          {/* Meta info */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b">
            <div className="flex items-center gap-4">
              <Link href={`/profil/${article.auteur._id}`}>
                <div className="flex items-center gap-3 hover:opacity-80 cursor-pointer">
                  <img
                    src={article.auteur.avatar || "/default-avatar.png"}
                    alt={article.auteur.nom}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {article.auteur.nom}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(
                        article.datePublication || article.createdAt,
                      ).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>👁️ {article.vues} vues</span>
              <span>•</span>
              <span>
                ⏱️ {Math.ceil(article.contenu.length / 1000)} min de lecture
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={handleLike}
              variant={liked ? "primary" : "secondary"}
              className="flex items-center gap-2"
            >
              {liked ? "❤️" : "🤍"} {article.nombreLikes}
            </Button>

            <Button
              onClick={handleFavorite}
              variant={favorited ? "primary" : "secondary"}
            >
              {favorited ? "⭐" : "☆"} Favoris
            </Button>

            <Button onClick={handleShare} variant="secondary">
              🔗 Partager
            </Button>

            {isAuthor && (
              <Button
                href={`/articles/${article._id}/modifier`}
                variant="secondary"
              >
                ✏️ Modifier
              </Button>
            )}
          </div>

          {/* Contenu */}
          <div className="prose prose-lg max-w-none">
            {article.contenu.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/articles?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Localisation */}
          {article.localisation?.ville && (
            <div className="mt-6 text-gray-600 flex items-center gap-2">
              📍 {article.localisation.ville}, {article.localisation.pays}
            </div>
          )}
        </article>

        {/* Auteur card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">À propos de l'auteur</h3>
          <Link href={`/profil/${article.auteur._id}`}>
            <div className="flex items-start gap-4 hover:opacity-80 cursor-pointer">
              <img
                src={article.auteur.avatar || "/default-avatar.png"}
                alt={article.auteur.nom}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">
                  {article.auteur.nom}
                </div>
                {article.auteur.bio && (
                  <p className="text-gray-600 mt-2">{article.auteur.bio}</p>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Section commentaires - à implémenter */}
        <div
          id="commentaires"
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">
            Commentaires ({article.nombreCommentaires || 0})
          </h3>
          {/* Composant CommentSection à créer */}
        </div>

        {/* Articles similaires */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Articles similaires
          </h3>
          {/* À implémenter */}
        </div>
      </div>
    </div>
  );
}
```

**Exercice 9.2 - Galerie d'images (2h)**

```javascript
// À créer : src/components/features/ImageGallery.jsx

"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="my-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={image.url}
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal plein écran */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size="xl"
      >
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            {selectedImage.alt && (
              <p className="text-center text-gray-600 mt-4">
                {selectedImage.alt}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

// Ajouter dans ArticleDetailPage après le contenu :
// <ImageGallery images={article.images} />
```

**Exercice 9.3 - Articles similaires (3h)**

```javascript
// À créer : src/components/features/SimilarArticles.jsx

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ArticleCard from "@/components/features/ArticleCard";
import Spinner from "@/components/common/Spinner";

export default function SimilarArticles({ articleId, categorieId, tags }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarArticles();
  }, [articleId]);

  const fetchSimilarArticles = async () => {
    try {
      // Stratégie : même catégorie OU tags communs
      const { data } = await api.get(
        `/articles?categorie=${categorieId}&limit=3`,
      );

      // Filtrer pour exclure l'article actuel
      const filtered = data.data.filter((a) => a._id !== articleId);
      setArticles(filtered.slice(0, 3));
    } catch (error) {
      console.error("Erreur chargement articles similaires:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (articles.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Articles similaires
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
}

// Ajouter dans ArticleDetailPage :
// <SimilarArticles
//   articleId={article._id}
//   categorieId={article.categorie._id}
//   tags={article.tags}
// />
```

**✅ Checkpoint Jour 14-15** : Page de détail complète avec likes, partage, galerie

---

### Jour 16-18 : Création/Édition d'article (12h)

**Exercice 10.1 - Formulaire de base (4h)**

```javascript
// À créer : src/app/articles/nouveau/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import api from "@/lib/axios";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Alert from "@/components/common/Alert";

export default function NouvelArticlePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(
        data.data.map((cat) => ({
          value: cat._id,
          label: cat.nom,
        })),
      );
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.titre || values.titre.length < 10) {
      errors.titre = "Le titre doit contenir au moins 10 caractères";
    } else if (values.titre.length > 200) {
      errors.titre = "Le titre ne peut pas dépasser 200 caractères";
    }

    if (!values.contenu || values.contenu.length < 50) {
      errors.contenu = "Le contenu doit contenir au moins 50 caractères";
    }

    if (!values.categorie) {
      errors.categorie = "Veuillez sélectionner une catégorie";
    }

    if (values.resume && values.resume.length > 300) {
      errors.resume = "Le résumé ne peut pas dépasser 300 caractères";
    }

    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm(
    {
      titre: "",
      contenu: "",
      categorie: "",
      resume: "",
      tags: "",
      ville: "",
    },
    validate,
  );

  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess("");

      // Transformer tags string en array
      const articleData = {
        ...values,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      if (values.ville) {
        articleData.localisation = {
          ville: values.ville,
          pays: "Côte d'Ivoire",
        };
      }

      const { data } = await api.post("/articles", articleData);
      setSuccess("Article créé avec succès !");

      setTimeout(() => {
        router.push(`/articles/${data.data.slug}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Nouvel article
        </h1>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && <Alert type="success">{success}</Alert>}
            {error && <Alert type="error">{error}</Alert>}

            {/* Titre */}
            <Input
              label="Titre de l'article *"
              name="titre"
              value={values.titre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.titre && errors.titre}
              placeholder="Un titre accrocheur pour votre article..."
            />
            <div className="text-sm text-gray-500">
              {values.titre.length}/200 caractères
            </div>

            {/* Catégorie */}
            <Select
              label="Catégorie *"
              name="categorie"
              options={categories}
              value={values.categorie}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.categorie && errors.categorie}
              placeholder="Choisir une catégorie"
            />

            {/* Résumé */}
            <Textarea
              label="Résumé (optionnel)"
              name="resume"
              rows={3}
              value={values.resume}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.resume && errors.resume}
              placeholder="Un court résumé de votre article..."
            />
            <div className="text-sm text-gray-500">
              {values.resume.length}/300 caractères
            </div>

            {/* Contenu */}
            <Textarea
              label="Contenu de l'article *"
              name="contenu"
              rows={15}
              value={values.contenu}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contenu && errors.contenu}
              placeholder="Racontez votre histoire..."
            />
            <div className="text-sm text-gray-500">
              {values.contenu.length} caractères • ~
              {Math.ceil(values.contenu.length / 1000)} min de lecture
            </div>

            {/* Tags */}
            <Input
              label="Tags (optionnel)"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="sport, football, CAN2024 (séparés par des virgules)"
            />
            <p className="text-sm text-gray-500">
              Ajoutez des tags pour aider les lecteurs à trouver votre article
            </p>

            {/* Localisation */}
            <Input
              label="Ville (optionnel)"
              name="ville"
              value={values.ville}
              onChange={handleChange}
              placeholder="Abidjan, Yamoussoukro, etc."
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Publication..." : "📝 Publier l'article"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>

        {/* Conseils */}
        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Conseils pour un bon article
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Choisissez un titre clair et informatif</li>
            <li>• Structurez votre contenu avec des paragraphes</li>
            <li>• Vérifiez vos informations avant de publier</li>
            <li>• Ajoutez des tags pertinents pour la visibilité</li>
            <li>• Soyez respectueux et objectif</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
```

**Exercice 10.2 - Upload d'images (4h)**

```javascript
// À créer : src/components/features/ImageUploader.jsx

"use client";

import { useState } from "react";
import api from "@/lib/axios";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Vérifier le nombre max d'images (5)
    if (images.length + files.length > 5) {
      setError("Maximum 5 images autorisées");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await api.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return {
          url: data.data.url,
          alt: "",
          isPrincipal: images.length === 0, // Première image = principale
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedImages]);
    } catch (err) {
      setError("Erreur lors de l'upload des images");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    // Si on supprime l'image principale, mettre la première comme principale
    if (newImages.length > 0 && images[index].isPrincipal) {
      newImages[0].isPrincipal = true;
    }
    onChange(newImages);
  };

  const handleSetPrincipal = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrincipal: i === index,
    }));
    onChange(newImages);
  };

  const handleAltChange = (index, alt) => {
    const newImages = [...images];
    newImages[index].alt = alt;
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Images (optionnel, max 5)
        </label>
        <span className="text-sm text-gray-500">{images.length}/5</span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Preview des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                {!image.isPrincipal && (
                  <button
                    type="button"
                    onClick={() => handleSetPrincipal(index)}
                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 px-3 py-1 rounded text-xs"
                  >
                    Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Supprimer
                </button>
              </div>

              {/* Badge principal */}
              {image.isPrincipal && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Principale
                </div>
              )}

              {/* Input alt */}
              <input
                type="text"
                placeholder="Description de l'image..."
                value={image.alt}
                onChange={(e) => handleAltChange(index, e.target.value)}
                className="mt-2 w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Bouton upload */}
      {images.length < 5 && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload">
            <Button
              as="span"
              variant="secondary"
              disabled={uploading}
              className="w-full cursor-pointer"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  Upload en cours...
                </span>
              ) : (
                "📸 Ajouter des images"
              )}
            </Button>
          </label>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Formats acceptés : JPG, PNG, GIF. Taille max : 5MB par image.
      </p>
    </div>
  );
}
```

**Exercice 10.3 - Intégration ImageUploader (1h)**

```javascript
// Modifier : src/app/articles/nouveau/page.js

// Ajouter dans le state :
const [images, setImages] = useState([]);

// Ajouter dans le formulaire après le contenu :
<ImageUploader images={images} onChange={setImages} />;

// Modifier onSubmit pour inclure les images :
const onSubmit = async (values) => {
  try {
    // ...
    const articleData = {
      ...values,
      images: images, // Ajouter les images
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };
    // ...
  } catch (err) {
    // ...
  }
};
```

**Exercice 10.4 - Page de modification (3h)**

```javascript
// À créer : src/app/articles/[id]/modifier/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import api from "@/lib/axios";
import { LoadingPage } from "@/components/common/Spinner";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Alert from "@/components/common/Alert";
import ImageUploader from "@/components/features/ImageUploader";

export default function ModifierArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.titre || values.titre.length < 10) {
      errors.titre = "Le titre doit contenir au moins 10 caractères";
    }
    if (!values.contenu || values.contenu.length < 50) {
      errors.contenu = "Le contenu doit contenir au moins 50 caractères";
    }
    if (!values.categorie) {
      errors.categorie = "Veuillez sélectionner une catégorie";
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm(
    {
      titre: "",
      contenu: "",
      categorie: "",
      resume: "",
      tags: "",
      ville: "",
    },
    validate,
  );

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    fetchData();
  }, [user, id]);

  const fetchData = async () => {
    try {
      const [articleRes, categoriesRes] = await Promise.all([
        api.get(`/articles/${id}`),
        api.get("/categories"),
      ]);

      const articleData = articleRes.data.data;

      // Vérifier que l'utilisateur est l'auteur
      if (articleData.auteur._id !== user.id && user.role !== "admin") {
        router.push("/");
        return;
      }

      setArticle(articleData);
      setCategories(
        categoriesRes.data.data.map((cat) => ({
          value: cat._id,
          label: cat.nom,
        })),
      );

      // Pré-remplir le formulaire
      setValues({
        titre: articleData.titre,
        contenu: articleData.contenu,
        categorie: articleData.categorie._id,
        resume: articleData.resume || "",
        tags: articleData.tags?.join(", ") || "",
        ville: articleData.localisation?.ville || "",
      });

      setImages(articleData.images || []);
    } catch (error) {
      console.error("Erreur chargement article:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess("");

      const articleData = {
        ...values,
        images,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      if (values.ville) {
        articleData.localisation = {
          ville: values.ville,
          pays: "Côte d'Ivoire",
        };
      }

      await api.put(`/articles/${id}`, articleData);
      setSuccess("Article modifié avec succès !");

      setTimeout(() => {
        router.push(`/articles/${article.slug}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      await api.delete(`/articles/${id}`);
      router.push("/profil/" + user.id);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  if (loading) return <LoadingPage />;
  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Modifier l'article
        </h1>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && <Alert type="success">{success}</Alert>}
            {error && <Alert type="error">{error}</Alert>}

            {/* Même formulaire que création */}
            <Input
              label="Titre de l'article *"
              name="titre"
              value={values.titre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.titre && errors.titre}
            />

            <Select
              label="Catégorie *"
              name="categorie"
              options={categories}
              value={values.categorie}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.categorie && errors.categorie}
            />

            <Textarea
              label="Résumé"
              name="resume"
              rows={3}
              value={values.resume}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.resume && errors.resume}
            />

            <Textarea
              label="Contenu *"
              name="contenu"
              rows={15}
              value={values.contenu}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contenu && errors.contenu}
            />

            <ImageUploader images={images} onChange={setImages} />

            <Input
              label="Tags"
              name="tags"
              value={values.tags}
              onChange={handleChange}
            />

            <Input
              label="Ville"
              name="ville"
              value={values.ville}
              onChange={handleChange}
            />

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "💾 Enregistrer"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Annuler
              </Button>

              <div className="flex-1" />

              <Button type="button" variant="danger" onClick={handleDelete}>
                🗑️ Supprimer
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
```

**✅ Checkpoint Jour 16-18** : Création et modification d'articles avec upload d'images

---

## 📅 SEMAINE 5 : Commentaires & Interactions

### Jour 19-20 : Système de commentaires (8h)

**Exercice 11.1 - Composant CommentForm (2h)**

```javascript
// À créer : src/components/features/CommentForm.jsx

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";

export default function CommentForm({
  articleId,
  parentId = null,
  onSuccess,
  onCancel,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/connexion");
      return;
    }

    if (contenu.trim().length < 2) {
      setError("Le commentaire doit contenir au moins 2 caractères");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await api.post(`/articles/${articleId}/comments`, {
        contenu: contenu.trim(),
        parent: parentId,
      });

      setContenu("");
      if (onSuccess) onSuccess(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 mb-3">
          Vous devez être connecté pour commenter
        </p>
        <Button href="/connexion" size="sm">
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

      <div className="flex items-start gap-3">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.nom}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />

        <div className="flex-1">
          <Textarea
            name="contenu"
            rows={parentId ? 2 : 3}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder={parentId ? "Répondre..." : "Ajouter un commentaire..."}
            className="mb-0"
          />

          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || contenu.trim().length === 0}
            >
              {isSubmitting ? "Envoi..." : parentId ? "Répondre" : "Commenter"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
              >
                Annuler
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
```

**Exercice 11.2 - Composant Comment (3h)**

```javascript
// À créer : src/components/features/Comment.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import Button from "@/components/common/Button";
import CommentForm from "./CommentForm";

export default function Comment({ comment, articleId, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [liked, setLiked] = useState(comment.likes?.includes(user?.id));
  const [likesCount, setLikesCount] = useState(comment.nombreLikes || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContenu, setEditContenu] = useState(comment.contenu);

  const isAuthor = user?.id === comment.auteur._id;
  const canModerate = user?.role === "admin" || user?.role === "moderator";

  const fetchReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const { data } = await api.get(`/comments/${comment._id}/replies`);
      setReplies(data.data);
      setShowReplies(true);
    } catch (error) {
      console.error("Erreur chargement réponses:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const { data } = await api.post(`/comments/${comment._id}/like`);
      setLiked(!liked);
      setLikesCount(data.likes);
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  const handleEdit = async () => {
    if (editContenu.trim() === comment.contenu) {
      setIsEditing(false);
      return;
    }

    try {
      const { data } = await api.put(`/comments/${comment._id}`, {
        contenu: editContenu.trim(),
      });
      onUpdate(data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur modification:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    try {
      await api.delete(`/comments/${comment._id}`);
      onDelete(comment._id);
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const handleReplySuccess = (newReply) => {
    setReplies([newReply, ...replies]);
    setShowReplyForm(false);
    setShowReplies(true);
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <Link href={`/profil/${comment.auteur._id}`}>
        <img
          src={comment.auteur.avatar || "/default-avatar.png"}
          alt={comment.auteur.nom}
          className="w-10 h-10 rounded-full flex-shrink-0 hover:opacity-80"
        />
      </Link>

      {/* Contenu */}
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-3">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profil/${comment.auteur._id}`}
              className="font-semibold text-gray-900 hover:text-blue-600"
            >
              {comment.auteur.nom}
            </Link>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-gray-400">(modifié)</span>
            )}
          </div>

          {/* Contenu */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContenu}
                onChange={(e) => setEditContenu(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  Enregistrer
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContenu(comment.contenu);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">
              {comment.contenu}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              liked ? "text-red-600" : "text-gray-600"
            } hover:text-red-600`}
            disabled={!user}
          >
            {liked ? "❤️" : "🤍"} {likesCount}
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-gray-600 hover:text-blue-600"
          >
            Répondre
          </button>

          {isAuthor && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-blue-600"
            >
              Modifier
            </button>
          )}

          {(isAuthor || canModerate) && (
            <button
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-600"
            >
              Supprimer
            </button>
          )}

          {comment.nombreReponses > 0 && (
            <button
              onClick={fetchReplies}
              className="text-blue-600 hover:text-blue-700"
            >
              {loadingReplies
                ? "Chargement..."
                : showReplies
                  ? "Masquer les réponses"
                  : `Voir ${comment.nombreReponses} réponse${comment.nombreReponses > 1 ? "s" : ""}`}
            </button>
          )}
        </div>

        {/* Formulaire de réponse */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              articleId={articleId}
              parentId={comment._id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Réponses */}
        {showReplies && replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                articleId={articleId}
                onUpdate={(updated) => {
                  setReplies(
                    replies.map((r) => (r._id === updated._id ? updated : r)),
                  );
                }}
                onDelete={(id) => {
                  setReplies(replies.filter((r) => r._id !== id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Exercice 11.3 - Section commentaires complète (3h)**

```javascript
// À créer : src/components/features/CommentSection.jsx

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async (pageNum = 1) => {
    try {
      const { data } = await api.get(
        `/articles/${articleId}/comments?page=${pageNum}&limit=10`,
      );

      if (pageNum === 1) {
        setComments(data.data);
      } else {
        setComments([...comments, ...data.data]);
      }

      setHasMore(data.pagination.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error("Erreur chargement commentaires:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleNewComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(
      comments.map((c) => (c._id === updatedComment._id ? updatedComment : c)),
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId));
  };

  const loadMore = () => {
    setLoadingMore(true);
    fetchComments(page + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulaire nouveau commentaire */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Laisser un commentaire</h3>
        <CommentForm articleId={articleId} onSuccess={handleNewComment} />
      </div>

      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              articleId={articleId}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}

          {/* Bouton charger plus */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Chargement..." : "Charger plus de commentaires"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      )}
    </div>
  );
}

// Intégrer dans ArticleDetailPage :
// import CommentSection from '@/components/features/CommentSection';
//
// <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//   <CommentSection articleId={article._id} />
// </div>
```

**✅ Checkpoint Jour 19-20** : Système de commentaires complet avec réponses, likes, édition

---

### Jour 21-22 : Dashboard utilisateur (8h)

**Exercice 12.1 - Page Dashboard (4h)**

```javascript
// À créer : src/app/dashboard/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { LoadingPage } from "@/components/common/Spinner";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tous");

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        api.get("/stats/me"),
        api.get("/articles/me/all"),
      ]);

      setStats(statsRes.data.data);
      setArticles(articlesRes.data.data);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!user) return null;

  const filteredArticles = articles.filter((article) => {
    if (activeTab === "tous") return true;
    return article.statut === activeTab;
  });

  const getStatutBadge = (statut) => {
    const config = {
      brouillon: { variant: "default", label: "Brouillon" },
      en_attente: { variant: "warning", label: "En attente" },
      publie: { variant: "success", label: "Publié" },
      rejete: { variant: "danger", label: "Rejeté" },
      archive: { variant: "default", label: "Archivé" },
    };
    const { variant, label } = config[statut] || config.brouillon;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mon tableau de bord
          </h1>
          <Button href="/articles/nouveau">➕ Nouvel article</Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats?.totalArticles || 0}
              </div>
              <div className="text-gray-600">Articles publiés</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats?.totalVues || 0}
              </div>
              <div className="text-gray-600">Vues totales</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {stats?.totalLikes || 0}
              </div>
              <div className="text-gray-600">Likes reçus</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats?.totalCommentaires || 0}
              </div>
              <div className="text-gray-600">Commentaires</div>
            </div>
          </Card>
        </div>

        {/* Article le plus populaire */}
        {stats?.topArticle && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-semibold mb-3">
              🏆 Votre article le plus populaire
            </h3>
            <Link href={`/articles/${stats.topArticle.slug}`}>
              <div className="flex justify-between items-center hover:opacity-80">
                <div>
                  <div className="font-semibold text-gray-900">
                    {stats.topArticle.titre}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {stats.topArticle.vues} vues
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Voir →
                </Button>
              </div>
            </Link>
          </Card>
        )}

        {/* Liste des articles */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Mes articles</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {["tous", "publie", "brouillon", "en_attente", "rejete"].map(
                (tab) => {
                  const count = articles.filter(
                    (a) => tab === "tous" || a.statut === tab,
                  ).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                      py-2 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }
                    `}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                    </button>
                  );
                },
              )}
            </nav>
          </div>

          {/* Table */}
          {filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Titre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vues
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Likes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {article.titre}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        {getStatutBadge(article.statut)}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {article.vues}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {article.nombreLikes}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm">
                        {new Date(article.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button
                            href={`/articles/${article._id}/modifier`}
                            size="sm"
                            variant="secondary"
                          >
                            Modifier
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {activeTab === "tous"
                ? "Vous n'avez pas encore d'articles"
                : `Aucun article ${activeTab}`}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
```

**Exercice 12.2 - Graphiques de stats (4h)**

```javascript
// À faire : npm install recharts

// À créer : src/components/features/StatsChart.jsx

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsChart({ data }) {
  if (!data || data.length === 0) return null;

  // Transformer les données pour recharts
  const chartData = data.map((item) => ({
    mois: `${item._id.month}/${item._id.year}`,
    articles: item.count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">
        📈 Évolution de vos publications
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="articles"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Ajouter dans DashboardPage après les stats cards :
// <StatsChart data={stats?.articlesParMois} />
```

**✅ Checkpoint Jour 21-22** : Dashboard complet avec stats et gestion d'articles

---

## 📅 SEMAINE 6 : Notifications & Finitions

### Jour 23-24 : Système de notifications (8h)

**Exercice 13.1 - Composant NotificationBell (3h)**

```javascript
// À créer : src/components/layout/NotificationBell.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import Badge from "@/components/common/Badge";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Fermer dropdown si clic extérieur
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data } = await api.get("/notifications?limit=10");
      setNotifications(data.data);
      setUnreadCount(data.meta.nonLuesCount);
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    }
  };

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && !loading) {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/lire`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, lue: true } : n,
        ),
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Erreur marquage notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/lire-toutes");
      setNotifications(notifications.map((n) => ({ ...n, lue: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur marquage notifications:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      nouveau_commentaire: "💬",
      reponse_commentaire: "↩️",
      like_article: "❤️",
      article_modere: "✅",
      nouveau_follower: "👤",
      mention: "📌",
    };
    return icons[type] || "🔔";
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge count */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Chargement...</div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    href={notification.lienAction || "#"}
                    onClick={() => {
                      if (!notification.lue) {
                        handleMarkAsRead(notification._id);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div
                      className={`
                        p-4 border-b hover:bg-gray-50 cursor-pointer
                        ${!notification.lue ? "bg-blue-50" : ""}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              notification.createdAt,
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!notification.lue && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Aucune notification
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t text-center">
            <Link
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Ajouter dans Header.jsx avant les actions :
// <NotificationBell />
```

**Exercice 13.2 - Page notifications (3h)**

```javascript
// À créer : src/app/notifications/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { LoadingPage } from "@/components/common/Spinner";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    fetchNotifications();
  }, [user, filter]);

  const fetchNotifications = async () => {
    try {
      const params = filter === "unread" ? "?nonLues=true" : "";
      const { data } = await api.get(`/notifications${params}`);
      setNotifications(data.data);
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/lire`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, lue: true } : n)),
      );
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/lire-toutes");
      setNotifications(notifications.map((n) => ({ ...n, lue: true })));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      nouveau_commentaire: "💬",
      reponse_commentaire: "↩️",
      like_article: "❤️",
      article_modere: "✅",
      nouveau_follower: "👤",
      mention: "📌",
    };
    return icons[type] || "🔔";
  };

  if (loading) return <LoadingPage />;
  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.lue).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-1">
                {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue
                {unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="secondary">
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-2 rounded-lg font-medium
              ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`
              px-4 py-2 rounded-lg font-medium
              ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Liste */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`
                  ${!notification.lue ? "bg-blue-50 border-l-4 border-blue-600" : ""}
                `}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1">
                    <Link
                      href={notification.lienAction || "#"}
                      onClick={() => {
                        if (!notification.lue) {
                          handleMarkAsRead(notification._id);
                        }
                      }}
                    >
                      <p className="text-gray-900 hover:text-blue-600">
                        {notification.message}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.lue && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Marquer comme lue
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-500">
              {filter === "unread"
                ? "Aucune notification non lue"
                : "Aucune notification"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
```

**Exercice 13.3 - Toast notifications (2h)**

```javascript
// À créer : src/components/common/ToastNotification.jsx

"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-6 py-4 rounded-lg shadow-lg
              transform transition-all duration-300
              ${toast.type === "success" ? "bg-green-600" : ""}
              ${toast.type === "error" ? "bg-red-600" : ""}
              ${toast.type === "info" ? "bg-blue-600" : ""}
              text-white
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "info" && "ℹ"}
              </span>
              <p>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 hover:opacity-80"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Ajouter dans layout.js :
// import { ToastProvider } from '@/components/common/ToastNotification';
//
// <ToastProvider>
//   <AuthProvider>
//     {children}
//   </AuthProvider>
// </ToastProvider>
```

**✅ Checkpoint Jour 23-24** : Système de notifications complet avec temps réel

---

### Jour 25-27 : SEO et Optimisations (12h)

**Exercice 14.1 - Metadata dynamique (3h)**

```javascript
// Modifier : src/app/articles/[slug]/page.js

// Ajouter avant le composant :
export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${params.slug}`,
    );
    const data = await res.json();
    const article = data.data;

    const imagePrincipale =
      article.images?.find((img) => img.isPrincipal) || article.images?.[0];

    return {
      title: `${article.titre} | Gbairai`,
      description: article.resume || article.contenu.substring(0, 160),
      openGraph: {
        title: article.titre,
        description: article.resume,
        images: imagePrincipale ? [imagePrincipale.url] : [],
        type: "article",
        publishedTime: article.datePublication,
        authors: [article.auteur.nom],
      },
      twitter: {
        card: "summary_large_image",
        title: article.titre,
        description: article.resume,
        images: imagePrincipale ? [imagePrincipale.url] : [],
      },
    };
  } catch (error) {
    return {
      title: "Article | Gbairai",
    };
  }
}

// Faire de même pour profil, catégories, etc.
```

**Exercice 14.2 - Sitemap (2h)**

```javascript
// À créer : src/app/sitemap.js

export default async function sitemap() {
  const baseUrl = "https://gbairai.com"; // Remplacer par votre domaine

  try {
    // Fetch articles
    const articlesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?limit=1000`,
    );
    const articlesData = await articlesRes.json();

    const articles = articlesData.data.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Fetch catégories
    const categoriesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    );
    const categoriesData = await categoriesRes.json();

    const categories = categoriesData.data.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      },
      ...articles,
      ...categories,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
```

**Exercice 14.3 - Optimisation images (2h)**

```javascript
// Utiliser le composant Next Image partout

// Modifier ArticleCard.jsx :
import Image from "next/image";

// Remplacer :
// <img src={imagePrincipale.url} ... />

// Par :
<Image
  src={imagePrincipale.url}
  alt={article.titre}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>;

// Faire de même pour tous les <img> dans l'app
```

**Exercice 14.4 - Loading states et Suspense (3h)**

```javascript
// À créer : src/app/articles/loading.js
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="h-48 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Faire de même pour d'autres pages
```

**Exercice 14.5 - Error boundaries (2h)**

```javascript
// À créer : src/app/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Quelque chose s\'est mal passé'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

// Page 404 personnalisée
// À créer : src/app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page introuvable</p>

          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
```

**✅ Checkpoint Jour 25-27** : SEO optimisé, performance améliorée

---

### Jour 28-30 : Tests et Déploiement (12h)

**Exercice 15.1 - Tests unitaires (4h)**

```javascript
// À faire : npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom

// Créer jest.config.js :
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);

// Créer jest.setup.js :
import "@testing-library/jest-dom";

// Exemple de test
// À créer : src/__tests__/components/Button.test.jsx
import { render, screen } from "@testing-library/react";
import Button from "@/components/common/Button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-blue-600");
  });
});

// Ajouter script dans package.json :
// "test": "jest --watch"
```

**Exercice 15.2 - Variables d'environnement production (2h)**

```javascript
// Créer .env.production :
NEXT_PUBLIC_API_URL=https://api.gbairai.com/api
NEXT_PUBLIC_APP_NAME=Gbairai
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud

// Vérifier toutes les variables d'env utilisées
// S'assurer qu'elles sont préfixées NEXT_PUBLIC_ si utilisées côté client
```

**Exercice 15.3 - Optimisation bundle (3h)**

```javascript
// Analyser le bundle
// npm install @next/bundle-analyzer

// Créer next.config.js :
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
  },
  // Compression
  compress: true,
  // Optimisation production
  swcMinify: true,
});

// Analyser : ANALYZE=true npm run build
```

**Exercice 15.4 - Déploiement Vercel (3h)**

```bash
# Installation Vercel CLI
npm install -g vercel

# Connexion
vercel login

# Déploiement
vercel

# Production
vercel --prod

# Configuration dans Vercel dashboard :
# - Ajouter variables d'environnement
# - Configurer domaine personnalisé
# - Activer analytics
# - Configurer caching
```

**Exercice 15.5 - Documentation (2h)**

```markdown
# Créer README.md complet

# Gbairai - Frontend Web

## Description

Application web Next.js pour la plateforme de journalisme citoyen Gbairai.

## Technologies

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Axios
- Recharts

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Créer `.env.local` :
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## Développement

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Structure du projet

\`\`\`
src/
├── app/ # Pages et routes
├── components/ # Composants réutilisables
├── hooks/ # Custom hooks
├── lib/ # Configuration (axios, etc.)
└── services/ # Services API
\`\`\`

## Features

- ✅ Authentification JWT
- ✅ CRUD articles avec images
- ✅ Système de commentaires
- ✅ Likes et favoris
- ✅ Notifications temps réel
- ✅ Dashboard utilisateur
- ✅ Recherche et filtres
- ✅ SEO optimisé
- ✅ Responsive design

## Déploiement

Déployé sur Vercel : https://gbairai.com
\`\`\`
```

**✅ Checkpoint Jour 28-30** : Application testée, optimisée et déployée

---

## 🎉 RÉCAPITULATIF FRONTEND WEB

**Tu as maintenant :**

✅ **App Next.js complète** avec App Router
✅ **Authentification** complète (login, register, reset password)
✅ **Pages principales** (accueil, articles, profil, dashboard)
✅ **CRUD articles** avec upload d'images
✅ **Système de commentaires** avec réponses
✅ **Interactions** (likes, favoris, partage)
✅ **Notifications** en temps réel
✅ **Recherche et filtres** avancés
✅ **Dashboard utilisateur** avec stats
✅ **SEO** optimisé (metadata, sitemap)
✅ **Performance** optimisée (images, bundle)
✅ **Responsive** sur tous devices
✅ **Tests** unitaires
✅ **Déployé** en production

---

## 📱 TEMPS ESTIMÉ : ~30 jours
