import { Heading, VStack, Icon, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";
import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

export function SignIn() {
  const [isLoading, setIsLoadiing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  function handleSingIn() {
    if (!email || !password) {
      return Alert.alert("entrar", "informe email e senha");
    }
    setIsLoadiing(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error.code);
        setIsLoadiing(false);

        if (error.code === "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail ou senha inválidos.");
        }
        if (error.code === "auth/wrong-password") {
          return Alert.alert("Entrar", "E-mail ou senha inválidos.");
        }
        if (error.code === "auth/user-not-found") {
          return Alert.alert("Entrar", "Usuário não cadastrado.");
        }
        return Alert.alert("Entrar", "Não foi possivel acessar");
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta!
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        mb={8}
        onChangeText={setPassword}
      />

      <Button
        onPress={handleSingIn}
        title="entrar"
        w="full"
        isLoading={isLoading}
      />
    </VStack>
  );
}
