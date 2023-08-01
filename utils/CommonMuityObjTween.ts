import { Utils } from "../../game/core/utils/Utils"

interface I_boxStyle{
    x: number
    y: number
    scale: number
    pos: number
}

interface I_boxComData{
    tweenNum: number
    pos: number //0开始
}

export default class CommonMuityObjTween {

    private _obj: any;
    private _clickHandler: Laya.Handler
    private _tweenOverHandler: Laya.Handler;
    private boxMap: {[index: number] : {boxStyle: I_boxStyle, boxComData: I_boxComData}} = {}
    public isTweening: boolean = false;
    private _tweenTime: number = 100;
    private _selectIndex: number = 0; 
    /**
     * 
     * @param obj 暂以obj下的所有子节点为基础样式,以第一个节点的位置作为旋转点
     * @param clickHandler handler: 点击立即执行
     * @param tweenOverHandler tween动画结束后执行
     */
    constructor( obj: any, clickHandler: Laya.Handler = null, tweenOverHandler: Laya.Handler = null) {
        this._obj = obj
        this._clickHandler = clickHandler;
        this._tweenOverHandler = tweenOverHandler;

        this._initBox()
        this._addBoxClickEvt()
    }   
    /**当前点击选中的index */
    public getSelectIndex() {
        return this._selectIndex;
    }
    /**设置动画执行时间 */
    public setTweenTime(time: number) {
        this._tweenTime = time
    }

    public clear(): void {
        for(let i = 0, len = this._obj.numChildren; i < len; i++) {
            Laya.Tween.clearAll(this._obj.getChildAt(i));
        }
        this.isTweening = false
    }

    private _initBox(): void {
        for(let i = 0, len = this._obj.numChildren; i < len; i++ ) {
            let _child = this._obj.getChildAt(i) as Laya.Box;
            let scale = _child.scaleX
            let styleData = <I_boxStyle>{ x : _child.x, y: _child.y, scale: scale, pos: i }
            this._setBoxStyle(_child, styleData)
            let boxComData = <I_boxComData>{ tweenNum: 0, pos: i }
            this.boxMap[i] = { boxStyle: styleData, boxComData: boxComData }
        }
        this.isTweening = false;
    }

    private _setBoxStyle(box: Laya.Box, styleData: I_boxStyle): void {
        let _box = box;
        _box.scale(styleData.scale, styleData.scale);
        _box.x = styleData.x 
        _box.y = styleData.y
    }

    private _addBoxClickEvt(): void {
        for(let i = 0, len = this._obj.numChildren; i < len; i++) {
            let _child = this._obj.getChildAt(i) as Laya.Box;
            if(_child.hasListener(Laya.Event.CLICK)) {
                _child.off(Laya.Event.CLICK, this, this.showObjChildByIndex)
            }
            _child.on(Laya.Event.CLICK, this, this.showObjChildByIndex, [i])
        } 
    }

    /**执行此方法会立即调用 clickHandler, isneedTime: false则跳过动画时间*/
    public showObjChildByIndex(boxIndex: number, isneedTime: boolean = true): void {
        this._selectIndex = boxIndex;

        this._clickHandler && this._clickHandler.run();
        if( this.isTweening ) {
            return;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        }
        let curData = this._getBoxDataByComPos(this._selectIndex)
        if(!curData)
            return
        if(curData.boxStyle.pos == 0)
            return;
        let len = Object.keys(this.boxMap).length
        let mid = len >> 1;
        let tweenNum: number = 0;
        let isRight: boolean = false;
        if(curData.boxStyle.pos > mid) {
            tweenNum = len - curData.boxStyle.pos;
            isRight = true;
        }else {
            tweenNum = curData.boxStyle.pos;
        }

        for(let i = 0; i < len; i ++) {
            let p_data = this.boxMap[i];
            if(p_data && p_data.boxComData) {
                p_data.boxComData.tweenNum = tweenNum;
                this._tween(i, isRight, isneedTime);  
            }
        }
    }

    private _isAllTweenComplete(): boolean {
        for(let k in this.boxMap) {
            if(this.boxMap[k] && this.boxMap[k].boxComData && this.boxMap[k].boxComData.tweenNum > 0) {
                return false
            }
        }
        return true
    }
   
    private _tween(boxIndex: number, isRight: boolean, isneedTime: boolean = true): void {
        this.isTweening = true
        let bool: boolean = this._isAllTweenComplete()
        if(bool) {
            this.isTweening = false;
            //所有得tween已结束
            if(this._tweenOverHandler) {
                this._tweenOverHandler.run();
            }
            return;
        }
        let curData = this.boxMap[boxIndex];
        let len = Object.keys(this.boxMap).length
        let nextIndex = isRight ? ( (boxIndex + 1) >= len ? 0: (boxIndex + 1) ) : ( (boxIndex- 1) < 0 ? (len - 1) : (boxIndex - 1) ) 
        let nextData = this.boxMap[nextIndex];
        if(!curData || !nextData) {
            this.isTweening = false
            return
        }
        let nextStyle = nextData.boxStyle;
        let box: Laya.Box = this._obj.getChildAt(curData.boxComData.pos) as Laya.Box
        Laya.Tween.to(box, {x: nextStyle.x, y: nextStyle.y, scaleX: nextStyle.scale , scaleY: nextStyle.scale}, isneedTime ? this._tweenTime : 0,null, Laya.Handler.create(this, this._tweenComplete, [boxIndex, isRight, isneedTime]))
    }

    private _tweenComplete(boxIndex: number, isRight: boolean, isneedTime: boolean): void {
        let curData = this.boxMap[boxIndex];
        curData.boxComData.tweenNum --;
        if( this._isAllTweenInSameStage() ) {
            //交换数据
            this._exChangeMapData(isRight)
            let len = Object.keys(this.boxMap).length
            for(let i = 0; i < len; i ++) {
                this._tween(i, isRight, isneedTime);  
            }
        }
    }
   
    private _exChangeMapData(isRight: boolean): void {
        let cloneMap = Utils.deepCopy(this.boxMap)
        let len = Object.keys(this.boxMap).length
        for( let k in this.boxMap ) {
            let curData = this.boxMap[k]
            let curIndex = parseInt(k)
            let preIndex = isRight ? ( (curIndex - 1) < 0 ? (len - 1) : (curIndex - 1) ) : ( (curIndex + 1) >= len ? 0: (curIndex + 1) )
            curData.boxComData = cloneMap[preIndex].boxComData
        }
    }

    private _isAllTweenInSameStage(): boolean {
        let tweenNum = this.boxMap[0].boxComData.tweenNum
        for( let k in this.boxMap ) {
            if(this.boxMap[k].boxComData.tweenNum != tweenNum) {
                return false
            }
        }
        return true
    }

    private _getBoxDataByComPos(pos: number) {
        for(let k in this.boxMap) {
            let comData = this.boxMap[k].boxComData
            if(comData.pos == pos){
                return this.boxMap[k]
            }
        }
        return null
    }
}