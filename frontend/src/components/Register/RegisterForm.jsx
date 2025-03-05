import { TextInput, PasswordInput,Space, Checkbox, Button, Group, Anchor, Paper, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const RegisterForm = ({ switchToLogin }) => {
  const form = useForm({
    initialValues: { name: "", email: "", password: "", acceptTerms: false },
    validate: {
      name: (value) => (value.length < 3 ? "Nom trop court" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email invalide"),
      password: (value) => (value.length < 6 ? "Min 6 caractères" : null),
    },
  });

  const handleSubmit = async (values) => {
    console.log("Register avec", values);
  };

  return (
    <Paper  shadow="0" p={30} radius="md">
      <Title order={2}>Structura</Title>
      <Space h="xl" />
    
      <Title order={3}>Bienvenue parmi nous</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Prénom" {...form.getInputProps("name")} mt="sm" />
        <TextInput label="Email" {...form.getInputProps("email")} mt="sm" />
        <PasswordInput label="Mot de passe" {...form.getInputProps("password")} mt="sm" />

        <Checkbox label="J'accepte les conditions générales" mt="sm" {...form.getInputProps("acceptTerms", { type: "checkbox" })} />

        <Button type="submit" fullWidth mt="xl">
          S'enregistrer
        </Button>
      </form>

      <Group position="center" mt="md">
        <Anchor size="sm" onClick={switchToLogin} style={{ cursor: "pointer" }}>
          Déjà un compte ? Se connecter
        </Anchor>
      </Group>
    </Paper>
  );
};

export default RegisterForm;
