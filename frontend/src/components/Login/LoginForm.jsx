import { TextInput, PasswordInput, Checkbox,Divider,Space, Button, Group, Anchor, Paper, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const LoginForm = ({ switchToRegister }) => {
  const form = useForm({
    initialValues: { email: "", password: "", remember: false },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email invalide"),
      password: (value) => (value.length < 6 ? "Min 6 caractères" : null),
    },
  });

  const handleSubmit = async (values) => {
    console.log("Login avec", values);
  };

  return (
    <Paper w={"80%"} shadow="0"  radius="md">
      <Title order={2}>Structura</Title>
      <Title align="left" order={3}>Ravi de vous revoir ! </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Email" {...form.getInputProps("email")} mt="sm" />
        <PasswordInput label="Mot de passe" {...form.getInputProps("password")} mt="sm" />
        
        <Group position="apart" mt="sm">
          <Checkbox label="Se souvenir de moi" {...form.getInputProps("remember", { type: "checkbox" })} />
          <Anchor href="#" size="sm">Mot de passe oublié ?</Anchor>
        </Group>

        <Space h="lg" />
        <Divider size="sm" />

        <Button type="submit" fullWidth mt="xl">
          Se connecter
        </Button>
      </form>

      <Group position="center" mt="md">
        <Anchor size="sm" onClick={switchToRegister} style={{ cursor: "pointer" }}>
          Pas de compte ? Créez-en un
        </Anchor>
      </Group>
    </Paper>
  );
};

export default LoginForm;
