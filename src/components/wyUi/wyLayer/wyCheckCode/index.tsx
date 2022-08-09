import { Formik } from "formik"
import styles from "./index.module.less"
import WyCode from "./wyCode"

interface WyCheckCodeProps {
  phone: string
}

export default function WyCheckCode(props: WyCheckCodeProps) {
  const hidePhone = (phone: string) => {
    const arr = phone.split('')
    arr.splice(3, 4, '****')
    return arr.join('')
  }
  return (
    <div className={styles.checkCode}>
      <div className={styles.jsMobwrap}>
        <p className={styles.sFc3}>
          你的手机号
          <strong className={styles.sFc1}>
            <span className={styles.jsMob}>{hidePhone(props.phone)}</span>
          </strong>
        </p>
        <p className={styles.sFc4}>为了安全，我们会给您发送短信验证码</p>
      </div>

      <div className={styles.form}>
        <WyCode />
      </div>
    </div >
  )
}