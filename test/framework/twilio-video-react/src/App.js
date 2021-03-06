import React, { Component } from 'react';
import { Client } from 'twilio-video';

export default class App extends Component {
  constructor(props) {
    super(props);

    var client;

    try {
      client = new Client(this.props.token);
    } catch (error) {
      this.state = { error: error };
      return;
    }

    this.state = {};

    client.connect().then(room => {
      this.setState({ room });
      room.once('disconnected', () => this.forceUpdate());
      room.disconnect();
    }, error => {
      this.setState({ error });
    });
  }

  componentWillUnmount() {
    if (this.state.room && this.state.room.state === 'connected') {
      this.state.room.disconnect();
    }
  }

  render() {
    if (this.state.error) {
      return <pre><code>{this.state.error.stack}</code></pre>;
    } else if (!this.state.room) {
      return <p>Connecting to a new Room&hellip;</p>;
    } else if (this.state.room.state === 'disconnected') {
      return <p>Disconnected from Room {this.state.room.sid}.</p>;
    }
    return <p>Connected to Room {this.state.room.sid}.</p>;
  }
}
