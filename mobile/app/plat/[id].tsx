import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDeletePlat, usePlat } from "../../src/hooks/usePlats";

export default function PlatDetail() {
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();
  const { data: plat, isPending, isError, error, refetch } = usePlat(id);
  const deletePlat = useDeletePlat();

  function handleDelete() {
    Alert.alert(
      "Supprimer ce plat ?",
      `« ${plat?.nom} » sera définitivement supprimé.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            if (!id) return;
            deletePlat.mutate(id, { onSuccess: () => router.back() });
          },
        },
      ]
    );
  }

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message ?? "Une erreur est survenue."}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nom}>{plat.nom}</Text>
      <Text style={styles.prix}>{Number(plat.prix).toFixed(2)} DH</Text>
      <Text style={styles.categorie}>{plat.categorie}</Text>
      <View
        style={[
          styles.badge,
          plat.disponible ? styles.badgeAvailable : styles.badgeUnavailable,
        ]}
      >
        <Text style={styles.badgeText}>
          {plat.disponible ? "Disponible" : "Indisponible"}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.editButton]}
          onPress={() => router.push({ pathname: "/form", params: { id } })}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deletePlat.isPending}
        >
          {deletePlat.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Supprimer</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#b00020",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  nom: {
    fontSize: 24,
    fontWeight: "700",
  },
  prix: {
    fontSize: 18,
    color: "#444",
  },
  categorie: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 24,
  },
  badgeAvailable: {
    backgroundColor: "#d4f5dd",
  },
  badgeUnavailable: {
    backgroundColor: "#fbdad9",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#222",
  },
  deleteButton: {
    backgroundColor: "#b00020",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
