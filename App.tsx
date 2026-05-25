import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { BrasilApiError, DddResponse } from "./src/types/brasilApi";

const API_BASE_URL = "https://brasilapi.com.br/api/ddd/v1";

export default function App() {
  const [ddd, setDdd] = useState<string>("");
  const [submittedDdd, setSubmittedDdd] = useState<string>("");
  const [searchTrigger, setSearchTrigger] = useState<number>(0);
  const [data, setData] = useState<DddResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isValidDdd = /^\d{2}$/.test(ddd);

  useEffect(() => {
    if (!submittedDdd || searchTrigger === 0) {
      return;
    }

    let isMounted = true;

    const fetchDddData = async () => {
      setLoading(true);
      setErrorMessage("");
      setData(null);

      try {
        const response = await fetch(`${API_BASE_URL}/${submittedDdd}`);

        if (!response.ok) {
          const apiError: BrasilApiError = await response.json();
          throw new Error(apiError.message);
        }

        const payload: DddResponse = await response.json();

        if (isMounted) {
          setData(payload);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Nao foi possivel consultar o DDD informado.";

          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchDddData();

    return () => {
      isMounted = false;
    };
  }, [searchTrigger, submittedDdd]);

  const handleChangeDdd = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    setDdd(numericValue);
    setErrorMessage("");
  };

  const handleSearch = () => {
    Keyboard.dismiss();

    if (!isValidDdd) {
      setErrorMessage("Informe um DDD com exatamente 2 digitos numericos.");
      setData(null);
      return;
    }

    setSubmittedDdd(ddd);
    setSearchTrigger((currentValue) => currentValue + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Brasil API</Text>
          <Text style={styles.title}>Consulta de localidades por DDD</Text>
          <Text style={styles.subtitle}>
            Digite um codigo de area para consultar a UF e a lista de cidades
            associadas.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>DDD</Text>
          <TextInput
            value={ddd}
            onChangeText={handleChangeDdd}
            placeholder="Ex.: 11"
            keyboardType="number-pad"
            maxLength={2}
            style={styles.input}
          />

          <Pressable
            onPress={handleSearch}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              (pressed || loading) && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Consultando..." : "Buscar localidades"}
            </Text>
          </Pressable>

          {!loading && errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.resultCard}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#6b3f20" />
              <Text style={styles.loadingText}>Buscando informacoes...</Text>
            </View>
          ) : null}

          {!loading && data ? (
            <>
              <Text style={styles.resultTitle}>Resultado do DDD {submittedDdd}</Text>
              <Text style={styles.stateBadge}>UF: {data.state}</Text>
              <Text style={styles.cityCount}>
                {data.cities.length} cidade(s) encontrada(s)
              </Text>

              <FlatList
                data={data.cities}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.cityItem}>
                    <Text style={styles.cityText}>{item}</Text>
                  </View>
                )}
              />
            </>
          ) : null}

          {!loading && !data && !errorMessage ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyTitle}>Nenhuma consulta realizada</Text>
              <Text style={styles.emptySubtitle}>
                Informe um DDD valido e toque no botao para carregar os dados.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5efe6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: "#8a5a3b",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#24160f",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    color: "#5c493c",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fffaf5",
    borderColor: "#ead8c9",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: "#623b1e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  label: {
    color: "#513623",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d8c0ad",
    borderRadius: 14,
    borderWidth: 1,
    color: "#24160f",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#6b3f20",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fffaf5",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    flex: 1,
    backgroundColor: "#fffdf9",
    borderColor: "#ead8c9",
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16,
  },
  centerContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: "#5c493c",
    fontSize: 15,
  },
  resultTitle: {
    color: "#24160f",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  stateBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f0d6bf",
    borderRadius: 999,
    color: "#6b3f20",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cityCount: {
    color: "#5c493c",
    fontSize: 14,
    marginBottom: 12,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  cityItem: {
    backgroundColor: "#f9f1e8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cityText: {
    color: "#362117",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyTitle: {
    color: "#24160f",
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "#6b5a4d",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
