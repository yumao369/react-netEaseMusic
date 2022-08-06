import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type ShareInfo = {
  id: string;
  type: string;
  txt: string;
}

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
  likeId: string;
  shareInfo?: ShareInfo
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
    },
    setShareInfo: (state, action: PayloadAction<{ shareInfo: ShareInfo }>) => {
      return { ...state, shareInfo: action.payload.shareInfo }
    }
  }
})

export const { setModalVisible, setModalType, setLikeId, setShareInfo } = memberSlice.actions

export const selectModalVisible = (state: RootState) => state.memberReducer.modalVisible;
export const selectModalType = (state: RootState) => state.memberReducer.modalType;
export const selectLikeId = (state: RootState) => state.memberReducer.likeId;
export const selectShareInfo = (state: RootState) => state.memberReducer.shareInfo;

export default memberSlice.reducer