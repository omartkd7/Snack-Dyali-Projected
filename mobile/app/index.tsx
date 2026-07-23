import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import type { Plat } from "../src/api/plats";
import { usePlats, useUpdatePlat } from "../src/hooks/usePlats";

export default function Index() {
  const router = useRouter();
  const { data: plats, isPending, isError, error, refetch } = usePlats();
  const toggleDispo = useUpdatePlat();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  function handleToggle(item: Plat) {
    setTogglingId(item.id);
    toggleDispo.mutate(
      { id: item.id, plat: { disponible: !item.disponible } },
      { onSettled: () => setTogglingId(null) }
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
      <FlatList
        data={plats}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={plats?.length ? styles.listContent : styles.emptyListContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Aucun plat pour l&apos;instant.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/plat/${item.id}`)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text style={styles.meta}>
                {Number(item.prix).toFixed(2)} DH · {item.categorie}
              </Text>
              <View
                style={[
                  styles.badge,
                  item.disponible ? styles.badgeAvailable : styles.badgeUnavailable,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.disponible ? "Disponible" : "Indisponible"}
                </Text>
              </View>
            </View>
            <Switch
              value={item.disponible}
              onValueChange={() => handleToggle(item)}
              disabled={togglingId === item.id}
            />
          </Pressable>
        )}
      />
      <Pressable style={styles.fab} onPress={() => router.push("/form")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  nom: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
});
