const ui = {
  state: {
    currentColor: "turquoise",
    pressedKeys: new Set(),
    selectedLayer: "main",
    selectedShape: null,
    selectedShapes: new Set(),
    showOutput: false,
  },
  mutations: {
    addPressedKey(state, key) {
      state.pressedKeys.add(key);
      state.pressedKeys = new Set(state.pressedKeys); // Workaround Vue's lack of first-class support reactivity for Sets
    },
    removePressedKey(state, key) {
      state.pressedKeys.delete(key);
      state.pressedKeys = new Set(state.pressedKeys); // Workaround Vue's lack of first-class support reactivity for Sets
    },
    selectColor(state, color) {
      state.currentColor = color;
    },
    selectLayer(state, layerId) {
      state.selectedLayer = layerId;
    },
    selectShape(state, { shape, keepSelection }) {
      if (keepSelection) {
        if (state.selectedShapes.has(shape)) {
          state.selectedShapes.delete(shape);
        } else {
          state.selectedShapes.add(shape);
        }
      } else {
        state.selectedShapes = new Set();
        if (shape) {
          state.selectedShapes.add(shape);
        }
      }
      state.selectedShapes = new Set(state.selectedShapes); // Workaround Vue's lack of first-class support reactivity for Sets
    },
    selectShapes(state, { shapes, keepSelection }) {
      if (!keepSelection) {
        state.selectedShapes = new Set();
      }
      for (const shape of shapes) {
        state.selectedShapes.add(shape);
      }
      state.selectedShapes = new Set(state.selectedShapes); // Workaround Vue's lack of first-class support reactivity for Sets
    },
    toggleOutput(state, value) {
      state.showOutput = value === undefined ? !state.showOutput : value;
    },
    unselectShape(state, shape) {
      state.selectedShapes.delete(shape);
    },
  },
  getters: {
    currentColor: (state) => state.currentColor,
    isKeyPressed: (state) => (key) => state.pressedKeys.has(key),
    isShapeSelected: (state) => (shape) => state.selectedShapes.has(shape),
    selectedLayer: (state) => state.selectedLayer,
    selectedShape: (state) =>
      state.selectedShapes.size === 1
        ? Array.from(state.selectedShapes)[0]
        : undefined,
    selectedShapes: (state) => Array.from(state.selectedShapes),
    selectMultiple: (state) => state.pressedKeys.has("Shift"),
    showOutput: (state) => state.showOutput,
  },
  actions: {
    addPressedKey({ commit }, key) {
      commit("addPressedKey", key);
    },
    removePressedKey({ commit }, key) {
      commit("removePressedKey", key);
    },
    selectAllShapes({ commit, getters }) {
      const selectedLayerId = getters.selectedLayer;
      if (getters.isLayerActive(selectedLayerId)) {
        const shapes = getters.layerShapes(selectedLayerId);
        commit("selectShapes", { shapes });
      }
    },
    selectColor({ commit }, color) {
      commit("selectColor", color);
    },
    selectLayer({ commit }, layerId) {
      commit("selectLayer", layerId);
    },
    selectShape({ commit, getters, dispatch }, { shape, keepSelection }) {
      commit("selectShape", { shape, keepSelection });
      const layerId = getters.layerIdFromShape(shape);
      return dispatch("selectLayer", layerId);
    },
    toggleOutput({ commit }, value) {
      commit("toggleOutput", value);
    },
    unselectShape({ commit }) {
      commit("selectShape", { shape: null });
    },
  },
};

export default ui;
