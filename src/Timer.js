import React, { Component } from 'react';
import './Timer.css';
import timerSound from './timer_alarm.mp3';
import { nanoid } from 'nanoid';

class TimerApp extends Component {
    constructor(props){
        super(props);
        this.state = {
            hh: '', mm: '', ss: '',
            timers: []
        };
        this.alarmAudio = new Audio(timerSound);
        this.alarmAudio.loop = true;

        this.handleStartTimer = this.handleStartTimer.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTimeBlur = this.handleTimeBlur.bind(this);
        this.handleDismissTimer = this.handleDismissTimer.bind(this);
    }
    componentDidMount() {
        this.intervalID = setInterval(() => {
            const timers = this.state.timers;
            let playAlarm = false;
            for (let i=0; i<timers.length; i++) {
                if (timers[i].endTime - Date.now() <= 0) {
                    playAlarm = true;
                    break;
                }
            }
            if (playAlarm) {
                if (this.alarmAudio.paused) {
                    this.alarmAudio.play();
                }
            } else {
                if (!this.alarmAudio.paused) {
                    this.alarmAudio.pause();
                    this.alarmAudio.currentTime = 0;
                }
            }
        }, 334);
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    handleStartTimer() {
        if (this.state.hh == '' && this.state.mm == '' && this.state.ss == ''){
            this.setState({hh: '', mm: '', ss: ''});
            return;
        }
        const date = new Date();
        date.setSeconds(date.getSeconds() + this.state.ss);
        date.setMinutes(date.getMinutes() + this.state.mm);
        date.setHours(date.getHours() + this.state.hh);
        
        this.setState(state => {
            return {hh: '', mm: '', ss: '', timers: [...state.timers, {endTime: date, id: nanoid()}]};
        });
    }
    handleTimeChange(name, value) {
        this.setState({
            [name]: parseInt(value),
        });
    }
    handleTimeBlur(target) {
        const value = target.value == '' ? 0 : parseInt(target.value);
        let valueNew = value < target.min ? target.min : 
            value > target.max ? target.max : value;
        this.setState({
            [target.name]: parseInt(valueNew),
        });
    }
    handleDismissTimer(id) {
        this.setState(state => {
            const timers = state.timers.filter(item => item.id !== id);
            return {timers};
        });
    }
    render() {
        return(
            <div>
                <TimerConfigurator hh={this.state.hh} mm={this.state.mm} ss={this.state.ss}
                    onStartTimer={this.handleStartTimer}
                    onTimeChange={this.handleTimeChange}
                    onTimeBlur={this.handleTimeBlur} />
                <TimersGrid timers={this.state.timers}
                    onDismissTimer={this.handleDismissTimer} />
            </div>
        );
    }
}

class TimerConfigurator extends Component {
    constructor(props) {
        super(props);

        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleNumberBlur = this.handleNumberBlur.bind(this);
        this.handleStartTimer = this.handleStartTimer.bind(this);
    }
    handleNumberChange(e) {
        this.props.onTimeChange(e.target.name, e.target.value);
    }
    handleNumberBlur(e) {
        this.props.onTimeBlur(e.target);
    }
    handleStartTimer() {
        this.props.onStartTimer();
    }
    render() {
        return(
            <div className="configurator">
                <h1 className="configurator__title">Timer Configurator:</h1>
                <input className="configurator__input-number" type="number" name="hh" 
                    step="1" placeholder="HH" value={this.props.hh} 
                    onBlur={this.handleNumberBlur} onChange={this.handleNumberChange}
                    max="99" min="0"></input>
                <input className="configurator__input-number" type="number" name="mm" 
                    step="1" placeholder="MM" value={this.props.mm} 
                    onBlur={this.handleNumberBlur} onChange={this.handleNumberChange}
                    max="60" min="0"></input>
                <input className="configurator__input-number" type="number" name="ss" 
                    step="1" placeholder="SS" value={this.props.ss} 
                    onBlur={this.handleNumberBlur} onChange={this.handleNumberChange}
                    max="60" min="0"></input>
                <input className="configurator__input-button" type="button" value="START"
                    onClick={this.handleStartTimer}></input>
            </div>
        );
    }
}

class TimersGrid extends Component {
    constructor(props) {
        super(props);

        this.handleDismissTimer = this.handleDismissTimer.bind(this);
    }
    handleDismissTimer(id) {
        this.props.onDismissTimer(id);
    }
    render(){
        const timers = this.props.timers;
        const timerItems = timers.map(timer => 
            <div className="grid__element" key={timer.id}><TimerClock 
                endTime={timer.endTime}
                onDismissTimer={this.handleDismissTimer}
                id={timer.id}
            /></div>
        );
        return(
            <div className="grid">
                {timers.length < 1 &&
                    <div className="grid__element grid__element_message">No active timers. Setup and start timer from above.</div>
                }
                {timerItems}
            </div>
        );
    }
}

class TimerClock extends Component {
    constructor(props) {
        super(props);
        this.handleDismissTimer = this.handleDismissTimer.bind(this);
        this.isComplete = false;
    }
    handleDismissTimer() {
        this.props.onDismissTimer(this.props.id);
    }
    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.forceUpdate();
        }, 334);
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        let endTime = this.props.endTime;
        let now = Date.now();
        let elapsed = endTime - now;
        let theme = 'clock_theme_complete';
        if (!this.isComplete) {
            theme = '';
            elapsed = elapsed < 0 ? 0 : elapsed;
            if (elapsed === 0) {
                this.isComplete = true;
            }
        } else {
            elapsed = 0;
        }
        let hours = Math.floor(elapsed / (60 * 60 * 1000));
        let minutes = Math.floor((elapsed - hours * 60 * 60 * 1000) / (60 * 1000));
        let seconds = Math.floor((elapsed - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / (1000));
        let timeLeft = `${addZeroToSingleDigit(hours)}:${addZeroToSingleDigit(minutes)}:${addZeroToSingleDigit(seconds)}`;
        return(
            <div className={'clock '+theme}>
                <p className="clock__digits">{timeLeft}</p>
                <button className="clock__button" onClick={this.handleDismissTimer}>Dismiss</button>
            </div>
        );
    }
}

function addZeroToSingleDigit(value) {
    return value < 10 ? `0${value}` : value;
}

export { TimerApp };