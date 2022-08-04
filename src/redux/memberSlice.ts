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
  modalType: ModalTypes;
  likeId: string;
}

export const defaultState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  likeId: ''
}

export const memberSlice = createSlice({
  name: 'member',
  initialState: defaultState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<{ modalVisible: boolean }>) => {
      return { ...state, modalVisible: action.payload.modalVisible };
    },
    setModalType: (state, action: PayloadAction<{ modalType: ModalTypes }>) => {
      return { ...state, modalType: action.payload.modalType };
    },
    setLikeId: (state, action: PayloadAction<{ likeId: string }>) => {
      return { ...state, likeId: action.payload.likeId }
    }
  }
})

export const { setModalVisible, setModalType, setLikeId } = memberSlice.actions

export const selectModalVisible = (state: RootState) => state.memberReducer.modalVisible;
export const selectModalType = (state: RootState) => state.memberReducer.modalType;
export const selectLikeId = (state: RootState) => state.memberReducer.likeId;

export default memberSlice.reducer