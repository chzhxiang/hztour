import * as types from "./mutation-type"
const mutations={
  [types.SET_UPDATATRAVELS](state,upDataTravels){
    state.upDataTravels=upDataTravels;
  },
  [types.SET_LOGINSUCCESS](state,loginSuccess){
    state.loginSuccess=loginSuccess;
  },
  [types.SET_TRAVELSDATEIL](state,travelsDateil){
    state.travelsDateil=travelsDateil;
  },
  [types.SET_TRAVELSDATEILSHOW](state,travelsDateilShow){
    state.travelsDateilShow=travelsDateilShow;
  },
  [types.SET_WRITETRAVELS](state,writeTravels){
    state.writeTravels=writeTravels;
  }
};
export default mutations;
