import React, { Children, ReactElement, RefAttributes, useEffect, useRef, useState } from "react";
import styles from "./index.module.less"
import Modal, { ModalTransitionComponent } from 'react-overlays/Modal'
import { TransitionCallbacks } from 'react-overlays/esm/types'
import Draggable from "react-draggable";
import { RenderModalBackdropProps, ModalHandle } from 'react-overlays/Modal'
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ModalTypes, selectModalType, selectModalVisible, setModalVisible } from "../../../../redux/memberSlice";
import { useSpring, animated } from "react-spring";
import { Transition, TransitionStatus } from 'react-transition-group';
import { switchExpr } from "../../../../common/functions";
import { controlModal } from "../../../../services/batchAction.service";

interface WyLayerModalProps {
  default: React.ReactNode,
  login: React.ReactNode,
  register: React.ReactNode,
  like: React.ReactNode,
  share: React.ReactNode,
  loadMySheets: () => Promise<void>
}

const duration = 300

const defaultStyle = {
  //transition: `opacity ${duration}ms ease-in-out,transform ${duration}ms ease-in-out`,
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  //transform: 'scale(0)'
}

const fadeStyles: { [id: string]: React.CSSProperties } = {
  entering: {
    //transform: 'scale(1)',
    opacity: 1
  },
  entered: {
    //transform: 'scale(1)',
    opacity: 1
  }
}

const Fade = ({ children, ...props }: { children: React.ReactElement, props: { [x: string]: any } }) => {
  const newChild = (
    <Transition {...props} timeout={duration}>
      {(status: TransitionStatus) => {
        if (children) {
          const cloned = React.cloneElement(children, {
            /**
             * problem:
             * if the style don't have the children.props.style in it,
             * the modal will not be dragged,cause the style will cover 
             * the react-draggable style,which is in the children.props.style.
             * 
             * solutiion:
             * add the children.props.style in the style below.
             * 
             * derived problem:
             * the drag will have a delay effect of 0.3s,cause it is controlled             
             * by the transform:translate and we have add a transition effect for 
             * the transform,and css transition cannot work for only one type of 
             * transform like scale.
             * status:
             * NOT SOLVED
             * In order not to affect the drag function,we now remove the transition
             * for the transform
             */
            style: { ...defaultStyle, ...fadeStyles[status], ...children.props.style }
          })
          return cloned
        }
      }}
    </Transition>
  )
  return newChild
}



export default function WyLayerModal(props: WyLayerModalProps) {

  const dispatch = useAppDispatch()

  const [draggable, setDraggable] = useState<boolean>(false)
  const modalRef = useRef<ModalHandle | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  const visible = useAppSelector(selectModalVisible)
  const modalType = useAppSelector(selectModalType)

  useEffect(() => {
    watchModalType()
  }, [modalType])

  /**
   * problem:
   * 这个地方可以使用js设计模式的策略模式进行优化
   * status:
   * NOT SOLVED
   */
  const watchModalType = () => {
    if (modalType === ModalTypes.Like) {
      props.loadMySheets()
    }
  }

  const handleClose = () => {
    controlModal(false)
  }

  const renderBackDrop = (props: RenderModalBackdropProps) => {
    return <div className={styles.backDrop} {...props} />
  }


  return (

    <Draggable disabled={!draggable}>
      <Modal
        className={styles.modal}
        ref={modalRef}
        show={visible}
        /**
         * problem:
         * we need to use ts-ignore in the code below,or ts will throw an
         * error.
         * status:
         * NOT SOLVED
         * Still don't know how to match the types on both sides of the 
         * equal sign
         */
        //@ts-ignore
        transition={Fade}
        renderBackdrop={renderBackDrop}>
        <div className={styles.mLayer} ref={popupRef} >
          <div className={styles.zbar} onMouseOver={() => { setDraggable(true) }} onMouseOut={() => { setDraggable(false) }}>
            <div className={styles.zttl}>这是标题</div>
          </div>
          {
            switchExpr(modalType)
              .caseIs(ModalTypes.LoginByPhone, props.login)
              .caseIs(ModalTypes.Register, props.register)
              .caseIs(ModalTypes.Like, props.like)
              .caseIs(ModalTypes.Share, props.share)
              .defaultAs(props.default)
          }
          <div className={styles.zcls} title="关闭" onClick={handleClose}></div>
        </div>
      </Modal>
    </Draggable>
  )
}
