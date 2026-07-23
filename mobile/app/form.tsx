import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useCreatePlat,
  usePlat,
  useUpdatePlat,
} from "../src/hooks/usePlats";

export default function Form() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const isEditing = !!id;

  const { data: plat, isPending: isLoadingPlat } = usePlat(id);
  const createPlat = useCreatePlat();
  const updatePlat = useUpdatePlat();

  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [errors, setErrors] = useState<{ nom?: string; prix?: string; categorie?: string }>({});

  useEffect(() => {
    if (isEditing && plat) {
      setNom(plat.nom ?? "");
      setPrix(plat.prix != null ? String(plat.prix) : "");
      setCategorie(plat.categorie ?? "");
    }
  }, [isEditing, plat]);

  const mutation = isEditing ? updatePlat : createPlat;

  function validate() {
    const nextErrors: { nom?: string; prix?: string; categorie?: string } = {};
    if (!nom.trim()) {
      nextErrors.nom = "Le nom est requis.";
    }
    const prixNumber = Number(prix.replace(",", "."));
    if (!prix.trim() || Number.isNaN(prixNumber) || prixNumber <= 0) {
      nextErrors.prix = "Le prix doit être un nombre positif.";
    }
    if (!categorie.trim()) {
      nextErrors.categorie = "La catégorie est requise.";
    }
    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, prixNumber };
  }

  function handleSubmit() {
    const { valid, prixNumber } = validate();
    if (!valid) return;

    const payload = {
      nom: nom.trim(),
      prix: prixNumber,
      categorie: categorie.trim(),
    };

    if (isEditing) {
      updatePlat.mutate(
        { id, plat: payload },
        { onSuccess: () => router.back() }
      );
    } else {
      createPlat.mutate(payload, { onSuccess: () => router.back() });
    }
  }

  if (isEditing && isLoadingPlat) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditing ? "Modifier le plat" : "Ajouter un plat"}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Tacos poulet"
        />
        {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Prix (DH)</Text>
        <TextInput
          style={styles.input}
          value={prix}
          onChangeText={setPrix}
          placeholder="35"
          keyboardType="decimal-pad"
        />
        {errors.prix && <Text style={styles.errorText}>{errors.prix}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Catégorie</Text>
        <TextInput
          style={styles.input}
          value={categorie}
          onChangeText={setCategorie}
          placeholder="Tacos"
        />
        {errors.categorie && <Text style={styles.errorText}>{errors.categorie}</Text>}
      </View>

      {mutation.isError && (
        <Text style={styles.errorText}>{mutation.error?.message}</Text>
      )}

      <Pressable
        style={[styles.submitButton, mutation.isPending && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditing ? "Enregistrer" : "Ajouter"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#b00020",
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
