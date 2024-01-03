# Outline

## Functionality
1. Stopwatch Style
   1. Start
   2. Pause
   3. Reset
   4. Laps
2. Countdown Style
3. Pomodoro Style (Repeating Intervals)
4. Notifications
5. Sounds & Mute


## Design Inspirations
1. ![A](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.VISV4hJf0YbkE9Fy7tJ_NQHaFj%26pid%3DApi&f=1&ipt=8a42bf180053bbf18862c73a3b97f77c36e4673f434d60cb2c53ba054f10aa8a&ipo=images)
2. ![B](https://www.google.com/imgres?imgurl=https%3A%2F%2F9to5google.com%2Fwp-content%2Fuploads%2Fsites%2F4%2F2022%2F10%2FGoogle-Clock-7.3-timer-tablet.jpg%3Fquality%3D82%26strip%3Dall&tbnid=tQDtUNkZuYk5wM&vet=12ahUKEwjj7r63xe_9AhXO03MBHU_KBa8QMygzegQIARBK..i&imgrefurl=https%3A%2F%2F9to5google.com%2F2022%2F10%2F14%2Fgoogle-clock-7-3%2F&docid=mXOhfwz1KFwdpM&w=2560&h=1280&q=ui%20design%20examples%20for%20timers&hl=en&ved=2ahUKEwjj7r63xe_9AhXO03MBHU_KBa8QMygzegQIARBK)

## Notes:
1. 2 ways to implement:  
   - [x] Storing startTime in ref (useRef). and elapsedTime in state. No useEffect required
   - [ ] Using useState and useEffect to detect changes in isActive/isPaused states
2. XState (state machine visualizer) might be useful