import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlat,
  deletePlat,
  getPlat,
  getPlats,
  updatePlat,
} from "../api/plats";

/** @typedef {import('../api/plats').Plat} Plat */
/** @typedef {import('../api/plats').PlatInput} PlatInput */

export function usePlats() {
  return useQuery({
    queryKey: ["plats"],
    queryFn: getPlats,
  });
}

/** @param {number|string} [id] */
export function usePlat(id) {
  return useQuery({
    queryKey: ["plats", id],
    queryFn: () => getPlat(/** @type {number|string} */ (id)),
    enabled: !!id,
  });
}

export function useCreatePlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: /** @param {PlatInput} plat */ (plat) => createPlat(plat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
    },
  });
}

export function useUpdatePlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:
      /** @param {{ id: number|string, plat: Partial<PlatInput> }} vars */
      (vars) => updatePlat(vars.id, vars.plat),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
      queryClient.invalidateQueries({ queryKey: ["plats", variables.id] });
    },
  });
}

export function useDeletePlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: /** @param {number|string} id */ (id) => deletePlat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
    },
  });
}
