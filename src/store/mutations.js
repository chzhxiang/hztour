import * as types from "./mutation-type"
const mutations={
  [types.SET_UPDATATRAVELS](state,upDataTravels){
    state.upDataTravels=upDataTravels;
  },
  [types.SET_LOGINSUCCESS](state,loginSuccess){
    state.loginSuccess=loginSuccess;
  }
};
export default mutations;
