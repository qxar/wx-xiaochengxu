import Home from './shopcar-modle.js'
import Config from './../../util/config.js'
const home = new Home()
let nums = 1
Page({
  data: {
    num:nums,
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    carTotal:0,
    history:[],
    loadingHidden: true,
    hiddens:true,
    theme: [],
    checked:true,
    checkeds: [],
    recommend: [],
    thisnum:[],
    allmoney:0,
    rootPath: Config.rootPath,
  },
  onLoad(options) {

    const value = wx.getStorageSync('history')
    home.getHomeData((data) => {
      this.setData({
        loadingHidden: false,
        theme: data.themes,
        recommend: data.recommends
      })
    })
    this.getlist()
    if(this.data.history !== false){
      this.setData({
        hiddens: false,
      })
    }
    this.getnum()
    let checknum = 0
    for (var i = 0; i < this.data.checkeds.length; i++) {
        checknum += this.data.thisnum[i] * value[i].recommend.pice
    }
    this.setData({
      allmoney: checknum
    })
  },

  onShareAppMessage: function () {

  },
  onPullDownRefresh() {
    home.refresh(() => {
      wx.stopPullDownRefresh()
    })
    this.onLoad() 
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      num: Number(e.detail.value) + 1
    })
  },
  add(e) {
    let n = e.currentTarget.dataset.index
    this.data.thisnum[n]++
    this.setData({
      thisnum: this.data.thisnum
    })
    wx.setStorageSync('historynum', this.data.thisnum)
    const value = wx.getStorageSync('history')
    if (this.data.checkeds[n]) {
      this.getmoney(e, value)
    }
  },
  minus(e) {
    let n = e.currentTarget.dataset.index
    if (this.data.thisnum[n] < 2) {
      this.data.thisnum[n] == 0
    } else {
      this.data.thisnum[n]--
    }
    this.setData({
      thisnum: this.data.thisnum
    })
    wx.setStorageSync('historynum', this.data.thisnum)
    const value = wx.getStorageSync('history')
    if (this.data.checkeds[n]){
      this.getmoney(e, value)
    }
  },


  getlist(e) {
    const historyvalue = wx.getStorageSync('historynum')
    const value = wx.getStorageSync('history')
    if (historyvalue){
      this.data.thisnum = historyvalue
      let car = 0
      for (var j = historyvalue.length - 1; j >= 0; j--) {
        car += historyvalue[j]
      }
      this.setData({
        thisnum: this.data.thisnum,
        history: value,
        carTotal: car
      })
    }else{
      let car = 0
      for (var j = value.length - 1; j >= 0; j--) {
        car += value[j].number
      }
      this.setData({
        carTotal: car,
        history: value
      })
    }
  },
  onShow() {
    this.onLoad()
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：')
  },


clickCheckall(e){
  const value = wx.getStorageSync('history')
  this.data.checked = !this.data.checked
  let itemSelected = []
  this.setData({
    checked: this.data.checked
  })
  if (this.data.checked){
    for (var j = value.length - 1; j >= 0; j--) {
      itemSelected.push(true)
    }
  }else{
    for (var j = value.length - 1; j >= 0; j--) {
      itemSelected.push(false)
    }

  }
  this.setData({
    checkeds: itemSelected
  })
  this.getmoney(e, value)
  },


  radioChange(){},

  itemSelected(e){
    const value = wx.getStorageSync('history')
    let s = e.currentTarget.dataset.index
    this.data.checkeds[s] = !this.data.checkeds[s]
    this.getmoney(e, value)
    var res = this.data.checkeds.indexOf(false)
    if(res == -1){
      this.setData({
        checked: true
      })
    }else
      this.setData({
        checked: false
      })
  },
  getmoney(e, value){
    let checknum = 0
    for (var i = 0; i < this.data.checkeds.length; i++) {
      if (this.data.checkeds[i] == true) {
        checknum += this.data.thisnum[i] * value[i].recommend.pice
      }
    }
    this.setData({
      checkeds: this.data.checkeds,
      allmoney: checknum
    })
  },


  getnum() {
    const value = wx.getStorageSync('history')
    let bool= true
    let thisnum=[]
    let itemSelected = []
    itemSelected.length = value.length
    for (var j = value.length - 1; j >= 0; j--) {
      itemSelected[j]=bool
      // itemSelected.push(bool)
      thisnum.push(value[j].number)
    }
    this.setData({
      thisnum: thisnum,
      checkeds: itemSelected
    })
  },
   clicks(e) {
     let q = e.currentTarget.dataset.index
    let id = this.data.history[q].recommend._id
    wx.navigateTo
      ({
        url: `../../pages/produce/produce?id=${id}`
      })
  },
  remover(e){
  
    let  numsa=e.currentTarget.dataset.index
    const value = wx.getStorageSync('history')
    wx.showModal({
      title: '确认删除?',
      content: '您确定要删除此条宝贝么┏༼ •́ ╭╮ •̀ ༽┓',
      success: (res)=> {
        if (res.confirm) {
        console.log(this.data)
          value.splice(numsa,1)
          wx.setStorageSync('history', value)
          this.onLoad()
        } else {
          console.log('用户点击取消')
        }
      }
    })
   
  }

})









