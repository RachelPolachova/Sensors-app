import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
    isRunning: false,
    totalArray: [],
    count: 0,
  }

  addToTotalArray = (accelerometerData) => {
    // console.log("Called add to tal avg")
    // aray of total acceleration
    let {x, y, z} = accelerometerData;
    let total = Math.sqrt(x*x+y*y);
    let index = this.state.count;
    console.log("Total: " + total)
    let a = this.state.totalArray;
    a[index] = total;
    this.setState({
      totalArray: a,
    })
    // after 15 items, start adding new total value from index 0
    index = index + 1
    if (index == 16) {
      this.setState({
        count: 0
      })
    } else {
      this.setState({
        count: index
      })
    }
    this.calculateAvg()
  }

  calculateAvg() {
    let array = this.state.totalArray;
    let sum = 0;
    console.log("array 0: " + array[0])
    for (i=0; i<array.length; i++) {
      sum = sum + array[i];
    }
    let avg = sum/array.length
    if (avg > 1.2) { 
      this.setState({
        isRunning: true
      })
    } else {
      this.setState({
        isRunning: false
      })
    }
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this.setState({
        totalArray: [],
        count: 0,
      })
      console.log("Deleted total array: " + this.state.totalArray.length)
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(100); 
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({
        accelerometerData: accelerometerData
      })
      this.addToTotalArray(accelerometerData)
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  

  render() {
    let { x, y, z } = this.state.accelerometerData;

    return (
      <View style={[styles.sensor, this.state.isRunning ? styles.isRunning : styles.isWalking]}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  isRunning: {
    backgroundColor: 'blue'
  },
  isWalking: {
    backgroundColor: 'yellow'
  },
});