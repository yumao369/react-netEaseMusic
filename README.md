
## summary:
1.Restart the project after adding .env file,or it may not work.
2.Having services in project.
3.notice that some HTML tags have user agent stylesheet.
4.scroll https://www.robinwieruch.de/react-scroll-to-item/
5.Do not call hooks inside loops,or you will get an error.look at the article attached below to learn about this problem.https://stackoverflow.com/questions/53472795/uncaught-error-rendered-fewer-hooks-than-expected-this-may-be-caused-by-an-acc
6.if you want to get a child component's method in parent component,you can use ref.But this require you to get the ref of a custom compoment,which is a little bit confused.
All you need to do is to use forwardRef and useImperativeHandle.You can see how I use these two method in WyPlayerPanel(parent component) and WyScroll(child component).In this example,I use wyscroll's method in wyplayerpanel.These two articles refer to how to use forwardRedf and useImperativeHanle to achieve our goal.
https://ilxanlar.medium.com/react-forwardref-in-two-minutes-2f33071c72fa
https://segmentfault.com/a/1190000040758640
there is still a problem,if you want to get a child component's children of its props,you should not pass the props.children in the ref,cause its type is Reactnode,you can't get a htmlelement's attribute from a reactnode or reactelement.So you need to pass ref.current.children,which is a htmlcollection,so you can get all the htmlelement's attribute from it.Just take a look at WyPlayerPanel(parent component) and WyScroll(child component),you can see how I implement the above.
(这个地方的场景就是，wyplayerpanel 里面的歌单列表需要可以滑动，可以用 better-scroll 来实现，首先用 better-scroll 写一个 Wyscroll 组件，wyplayerpanel 组件引入 wyscroll，然后用 wyscroll 包裹需要滑动的部分，这部分就是 wyscroll 的 props 中的 children,这部分是一个 ul，里面有若干 li，如果 wyplayerpanel 可以显示六首歌，而这个列表中有十首歌，那么，当切到第七首时，需要调用 scrolltoelement 将第七首滑动到可视区域，这时候操作这个方法需要到 wyplayerpanel 里面进行操作更为合理，具体可以看代码)

## still need to work:
1.the styles of header at home page.
2.the styles of dots of carousel at home page.
3.resolve:seems there isn't any method to implement a react route resolve.
4.optional chaining (?.) Parsing error: Expression expected.eslint(solved by re-installiing eslint in version 7.5.0 can compile successfully,but still have this problem in the code.Check this problem in wyPlayer component.)

## obstacles:
1.How to deal with the less styles,as the less modules in react has an unique global variable name,but for some styles,I want to use the same classname everywhere.
2.how to add resolve to ensure that the components are loaded after the data is loaded every time, so as to avoid empty components that affect the user experience.
3.How to set state in observable of fromEvent,cause every time I set state when I subscribe the observable,the component will be rerendered,unsubscribing from observables.
4.how to get the value of [(ngmodel)] in child component in angular.You can see the proble in wy-player component.
5.if you pass a state from parent to child and use this state in observables,data will not change if you don't unsubscribe this observable.

## solutions: 
1.https://dev.to/codeprototype/configuring-both-css-modules-and-global-css-for-reactjs-in-webpack-4ci7
https://angular.io/guide/view-encapsulation#inspect-generated-css
for example:in component wyCarousel,for the second div,we need it to be displayed as a wrap.We already have .wrap class that could be used every,but we have some unique styles for this particular wrap,so we can make it possibel like what I have done.
3.add a dependency to useeffect hook.Please look at the questions I asked at stack overflow and WySlider component in this project.
4.use ControlvalueAccessor.Look at this artical and answer one https://stackoverflow.com/questions/41350584/angular2-pass-ngmodel-to-a-child-component .Look at this example of how to simply use ngmodel and controvalueaccessor https://github.com/yumao369/angularTest
5.You can find this instance in wyPlayer and wySlider.There is a simple example of how this means.https://codesandbox.io/s/green-resonance-w4dsh8?file=/src/App.js . When you click the number of this example,the number will be added by 1.Then if you click bbb,you will see the latest number in the console.If you click ccc,you will see the initial number.

## about router gaurd：
https://blog.51cto.com/u_12379999/4635824#:~:text=%E8%B7%AF%E7%94%B1%E5%AE%88%E5%8D%AB%E6%98%AF%E6%8C%87%E5%BD%93,%E7%9A%84%E5%B0%B1%E5%8F%AB%E8%B7%AF%E7%94%B1%E5%AE%88%E5%8D%AB%E3%80%82

https://blog.netcetera.com/how-to-create-guarded-routes-for-your-react-app-d2fe7c7b6122

## about route resolve:
https://blog.csdn.net/hui8758/article/details/110142559
https://angular.io/api/router/Resolve

## 项目简介：
该项目实现了一个react版本的网易云音乐软件，包含7个页面，如下：

1、home页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/1.PNG)

2、歌单页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/2.PNG)

3、歌单详情页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/3.PNG)

4、歌曲详情页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/4.PNG)

5、歌手详情页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/5.PNG)

6、个人中心页
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/6.PNG)

7、个人听歌记录
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/7.PNG)

除此之外还实现了搜索功能，登录功能，播放功能，如下：
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/8.PNG)
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/10.PNG)
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/11.PNG)

登录之后界面如下：
![image](https://github.com/yumao369/react-netEaseMusic/blob/13-2/src/assets/images/readmeimg/9.PNG)

## 启动接口
git clone [https://github.com/Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)\
npm i\
npm start

## 项目启动
git clone [https://github.com/yumao369/react-netEaseMusic.git](https://github.com/yumao369/react-netEaseMusic.git)\
npm i\
npm start





