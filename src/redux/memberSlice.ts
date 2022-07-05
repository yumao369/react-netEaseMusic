import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes
}

export const defaultState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default
}

export const memberSlice = createSlice({
  name: 'member',
  initialState: defaultState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<{ modalVisible: boolean }>) => {
      return { ...state, playing: action.payload.modalVisible };
    },
    setModalType: (state, action: PayloadAction<{ modalType: boolean }>) => {
      return { ...state, playing: action.payload.modalType };
    }
  }
})

export const { setModalVisible, setModalType } = memberSlice.actions

export const selectModalVisible = (state: RootState) => state.memberReducer.modalVisible;
export const selectModalType = (state: RootState) => state.memberReducer.modalType;

export default memberSlice.reducer