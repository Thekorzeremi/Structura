import { TextInput, PasswordInput, Space, Checkbox, Button, Group, Anchor, Paper, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const RegisterForm = ({ switchToLogin }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    initialValues: { name: "", lastname: "", email: "", password: "", acceptTerms: false },
    validate: {
      name: (value) => (value.length < 3 ? "Nom trop court" : null),
      lastname: (value) => (value.length < 3 ? "Nom de famille trop court" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email invalide"),
      password: (value) => (value.length < 6 ? "Min 6 caractères" : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("/http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: values.name,
          last_name: values.lastname,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      alert("Inscription réussie! Token: " + data.token);
      switchToLogin();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Paper shadow="0" p={30} radius="md">
      <Title order={2}>Structura</Title>
      <Space h="xl" />
      <Title order={3}>Bienvenue parmi nous</Title>
      <Space h="lg" />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Prénom" {...form.getInputProps("name")} mt="sm" />
        <TextInput label="Nom de famille" {...form.getInputProps("lastname")} mt="sm" />
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
