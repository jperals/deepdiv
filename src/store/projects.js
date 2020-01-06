import uuid from "uuid/v1";
import { warn } from "@/warn";

const projects = {
  state: {
    currentProject: null,
    projects: []
  },
  getters: {
    projects: state => state.projects
  },
  mutations: {
    addNewProject(state) {
      state.projects = state.projects.concat([
        {
          id: uuid()
        }
      ]);
    },
    removeProject(state, project) {
      const index = state.projects.findIndex(item => item === project);
      if (-1 < index) {
        state.projects.splice(index, 1);
      } else {
        warn("Project to be removed not found");
      }
    }
  },
  actions: {
    addNewProject({ commit }) {
      return commit("AddProject", project);
    },
    modifyProject({ commit }, { project, newProps }) {
      return commit("modifyProject", { project, newProps });
    }
  }
};

export default projects;
