/**
 * A sequence is an ordered list (aka sequence) or steps or animations to
 * be perormed, each step needs to implement the API of having a tick() method
 * which is called every update until the is_done property returns true. At that
 * point the sequence moves onto the next step.
 */
class Sequence {
  constructor(steps) {
    this.steps = steps
    this.step_idx = 0
    this.is_done = false
  }

  tick() {
    if (this.is_done) {
      return
    }

    let step = this.steps[this.step_idx]
    if (step.is_done) {
      this.step_idx += 1
      if (this.step_idx == this.steps.length) {
        this.is_done = true
        return
      }
      step = this.steps[this.step_idx]
    }
    step.tick();
  }
}

/**
 * A single call (aka step) in a sequence, once the callback is
 * invoked once the step is done
 */
class Step {
  constructor(callback) {
    this.callback = callback
    this.is_done = false
  }

  tick() {
    this.callback()
    this.is_done = true
  }
}

class Animation {
  constructor() {
    this.t = 0;
  }

  ticks(num_ticks) {
    this.num_ticks = num_ticks;
    return this;
  }

  update(callback) {
    this.update_callback = callback;
    return this;
  }

  done(callback) {
    this.done_callback = callback;
    return this;
  }

  tick() {
    this.t += 1
    if (this.update_callback !== undefined) {
      this.update_callback(this.t / this.num_ticks);
    }
    if (this.is_done && this.done_callback !== undefined) {
      this.done_callback();
    }
    return this;
  }

  get is_done() {
    return this.t == this.num_ticks
  }
}
