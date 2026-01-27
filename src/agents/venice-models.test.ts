import { describe, expect, it } from "vitest";
import {
  buildVeniceModelDefinition,
  discoverVeniceModels,
  VENICE_COMPAT,
  VENICE_MODEL_CATALOG,
} from "./venice-models.js";

describe("venice-models", () => {
  describe("VENICE_COMPAT", () => {
    it("should disable store parameter support", () => {
      expect(VENICE_COMPAT.supportsStore).toBe(false);
    });

    it("should disable developer role support", () => {
      expect(VENICE_COMPAT.supportsDeveloperRole).toBe(false);
    });
  });

  describe("buildVeniceModelDefinition", () => {
    it("should include compat settings in model definition", () => {
      const entry = VENICE_MODEL_CATALOG[0];
      const model = buildVeniceModelDefinition(entry);

      expect(model.compat).toBeDefined();
      expect(model.compat?.supportsStore).toBe(false);
      expect(model.compat?.supportsDeveloperRole).toBe(false);
    });

    it("should build all catalog models with compat settings", () => {
      for (const entry of VENICE_MODEL_CATALOG) {
        const model = buildVeniceModelDefinition(entry);
        expect(model.compat).toEqual(VENICE_COMPAT);
      }
    });

    it("should preserve model properties from catalog entry", () => {
      const entry = VENICE_MODEL_CATALOG.find((m) => m.id === "llama-3.3-70b");
      expect(entry).toBeDefined();
      if (!entry) return;

      const model = buildVeniceModelDefinition(entry);

      expect(model.id).toBe("llama-3.3-70b");
      expect(model.name).toBe("Llama 3.3 70B");
      expect(model.reasoning).toBe(false);
      expect(model.input).toContain("text");
      expect(model.contextWindow).toBe(131072);
      expect(model.maxTokens).toBe(8192);
    });
  });

  describe("discoverVeniceModels", () => {
    it("should return models with compat settings (static catalog fallback in test env)", async () => {
      // In test environment, discoverVeniceModels uses static catalog
      const models = await discoverVeniceModels();

      expect(models.length).toBeGreaterThan(0);

      for (const model of models) {
        expect(model.compat).toBeDefined();
        expect(model.compat?.supportsStore).toBe(false);
        expect(model.compat?.supportsDeveloperRole).toBe(false);
      }
    });
  });

  describe("VENICE_MODEL_CATALOG", () => {
    it("should have at least 20 models", () => {
      expect(VENICE_MODEL_CATALOG.length).toBeGreaterThanOrEqual(20);
    });

    it("should have both private and anonymized models", () => {
      const privacyModes = new Set(VENICE_MODEL_CATALOG.map((m) => m.privacy));
      expect(privacyModes.has("private")).toBe(true);
      expect(privacyModes.has("anonymized")).toBe(true);
    });
  });
});
