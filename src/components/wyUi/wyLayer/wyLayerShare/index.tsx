import TextArea from "antd/lib/input/TextArea";
import { Field, FieldProps, Formik, FormikHandlers, FormikProps, useField } from "formik";
import * as Yup from 'yup';
import { Form, FormItem } from "formik-antd";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { ShareInfo } from "../../../../redux/memberSlice";
import styles from "./index.module.less"
import { Button } from "antd";
import { ShareParams } from "../../../../services/member.service";

interface WyLayerShareProps {
  /**
   * problem:
   * shareinfo在app里面是从redux的状态中取出的，为ShareInfo|undefined类型，
   * 但是当WyLayerShare能被渲染出来时，这个值一定不可能是undefined类型，所以以下
   * 代码是可以优化的，但是目前不知道如何优化
   * status:
   * NOT SOLVED
   */
  shareInfo: ShareInfo | undefined,
  onCancel: () => void,
  onShare: (args: ShareParams) => Promise<void>
}

const MAX_MSG = 140

interface ShareForm {
  shareMsg: string;
}

interface ErrorForm {
  shareMsg?: string;
}

interface MyTextAreaProps {
  name: string;
  rows: number;
  onChange: FormikHandlers['handleChange']
}

const MyTextArea = (props: MyTextAreaProps) => {
  const [field, meta] = useField(props)
  return (
    <>
      <TextArea {...field} {...props} className={meta.error ? styles.error : ''} />
      {meta.error ? (
        <div className={styles.errorTip}>{meta.error}</div>
      ) : null}
    </>
  )
}

export default function WyLayerShare(props: WyLayerShareProps) {

  //let isvalid
  let handleSubmit: FormikHandlers['handleSubmit']

  const initialValues: ShareForm = { shareMsg: '' }

  const [surplusMsgCount, setSurplusMsgCount] = useState<number>(MAX_MSG)
  const [isValid, setIsValid] = useState<boolean>(true)
  //const [handleSubmit, setHandleSubmit] = useState<FormikHandlers['handleSubmit']>()
  //const [values, setValues] = useState<ShareForm>(initialValues)
  //const formRef = useRef<FormikProps<ShareForm>>()

  const handleSubmitClick = () => {
    //formRef.current?.handleSubmit()
    if (handleSubmit) {
      handleSubmit()
    }
  }

  //useEffect(() => {
  //  console.log('formRef.current?.isValid', formRef.current?.isValid)
  //  console.log(formRef.current?.errors.shareMsg)
  //}, [formRef.current?.errors.shareMsg])

  return (
    <div className={styles.share}>
      <div className={styles.uTxtwrap}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            shareMsg: Yup.string()
              .max(MAX_MSG, "不能超过140个字")
              .required("必填")
          })}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false)
            if (props.shareInfo) {
              props.onShare({
                id: props.shareInfo.id,
                msg: values.shareMsg,
                type: props.shareInfo.type
              })
            }
          }}
        /**
         * 问题：
         * 这个地方用ref去取会有问题，从上面的useeffect取出来的值，总是比真实的值滞后一个动作，
         * 比如现在输入到第140个字，这时isvalid还是true，当再输入一个值时，isvalid应该是false，
         * 但是通过ref去取这个值时，得到的还是true，当我们输入第142个字时，这个值才变成false
         * status:
         * NOT SOLVED
         */
        //@ts-ignore
        //innerRef={formRef}
        >
          {(props: FormikProps<ShareForm>) => {
            //handlechange will synchronize the update of value['key']
            //console.log('values', props.values.shareMsg)
            setSurplusMsgCount(MAX_MSG - props.values.shareMsg.length)
            setIsValid(props.isValid)
            /**
             * problem:
             * there will a problem that is too many re-renders if we use setHandleSubmit
             * to get the handleSubmit function
             * status:
             * NOT SOLVED
             */
            //setHandleSubmit(props.handleSubmit)
            //isvalid = props.isValid
            handleSubmit = props.handleSubmit
            console.log('isvalid', props.isValid)
            return (
              <Form >
                <MyTextArea name="shareMsg" rows={6} onChange={props.handleChange} />
              </Form>
            )
          }}

        </Formik>

        <div className={styles.info}>
          <div className={styles.text}>
            <p className="f-thide ellipsis">{props.shareInfo?.txt}</p>
          </div>
        </div>
      </div>

      <div className={[styles.tools, 'clearfix'].join(' ')}>
        <span className={[styles.txtCount, surplusMsgCount < 0 ? styles.exceed : ''].join(' ')}>{surplusMsgCount}</span>
        <div className={styles.btns}>
          <Button onClick={props.onCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmitClick} disabled={!isValid}>分享</Button>
        </div >
      </div >
    </div >
  )
}