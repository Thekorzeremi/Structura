import { Grid, Paper, Image, Stack, Title, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Register/RegisterForm";

const AuthPage = ({ type }) => {
  const navigate = useNavigate();

  return (
    <Container size="xl" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper shadow="xl" w={"100%"} radius="md" withBorder >
        <Grid gutter={0}>
          {/* Partie gauche avec l’image */}
          <Grid.Col span={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/btp_login.png" alt="BTP Login" height="100%" width="100%" fit="cover"radius="md"/>
          </Grid.Col>

          {/* Partie droite avec le formulaire */}
          <Grid.Col span={4} p="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack pt={"25px"} h={"100%"} w="100%">
              {type === "login" ? (
                <LoginForm switchToRegister={() => navigate("/register")} />
              ) : (
                <RegisterForm switchToLogin={() => navigate("/login")} />
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AuthPage;

           