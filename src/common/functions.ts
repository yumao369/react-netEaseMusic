class SwitchExpr<T> {
  shot = false
  targetObj: T | null = null
  val = null

  constructor(obj: T) {
    this.targetObj = obj
  }

  caseIs(caseKey: T, caseValue: any) {
    if (!this.shot && caseKey === this.targetObj) {
      this.val = caseValue
      this.shot = true
    }
    console.log('switchthis', this)
    return this
  }


  defaultAs(defaultValue: any): any {
    return this.shot ? this.val : defaultValue
  }
}

export function switchExpr<T>(obj: T) {
  return new SwitchExpr(obj)
}