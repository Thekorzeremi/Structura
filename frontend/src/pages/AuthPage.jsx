import { useState } from "react";
import { Container,Box } from "@mantine/core";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Register/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box display="flex" h="100vh" >
      {/* Image de fond */}
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/construction.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Formulaire */}
      <Container size={420} my={40} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {isLogin ? <LoginForm switchToRegister={() => setIsLogin(false)} /> : <RegisterForm switchToLogin={() => setIsLogin(true)} />}
      </Container>
    </Box>
  );
};

export default AuthPage;
