import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Bienvenue {user?.firstName}</span>
    </div>
  );
}