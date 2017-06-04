class Tracker {
  constructor() {
    // nothing to do
  }


  /**
   * @static collide - runs collision detection between to lists
   * of tracked objects and optionally removing them
   *
   * @param  {class} clazz_a      The first Class of instances to check
   * @param  {class} clazz_b      The second Class of instances to check
   * @param  {function} collider     A function which takes an instance of class A
   * and an instance of class B and returns true if they have collide
   * @param  {function} on_collision A function which is called if the two
   * objects collide and returns an array of booleans, [a, b, abort],
   * "a == true" means stop tracking instance A, "b == true" means stop tracking
   * instance B, "abort == true" means do not perform any more collision checks
   */
  static collide(clazz_a, clazz_b, collider, on_collision) {
    const instances_of_a = Tracker.getInstances(clazz_a)
    const instances_of_b = Tracker.getInstances(clazz_b)
    for (let i = instances_of_a.length - 1; i >= 0 ; i--) {
      for (let j = instances_of_b.length - 1; j >= 0 ; j--) {
        const a = instances_of_a[i]
        const b = instances_of_b[j]

        if (!collider(a, b)) {
          continue
        }

        let ret = on_collision(a, b)
        if (ret === undefined) {
          continue
        }
        // ret = [a, b, abort]
        if (ret[1]) {
            instances_of_b.splice(j, 1)
        }
        if (ret[0]) {
          instances_of_a.splice(i, 1)
          // if abort then don't break just exit
          if (ret[2]) {
            return;
          } else {
            break;
          }
        }
        if (ret[2]) {
          return;
        }
      }
    }
  }

  static getInstances(type) {
    let instances = Tracker.instances[type.name];
    if (!instances) {
      instances = [];
      Tracker.instances[type.name] = instances;
    }
    return instances;
  }

  static add(instance) {
    const clazz = instance.constructor;
    let i = this.getInstances(clazz)
    i.push(instance);
  }

  static remove(instance) {
    const instances = this.getInstances(instance.constructor);
    const i = instances.indexOf(instance);
    if (i != -1) {
    	instances.splice(i, 1);
    }
  }

  static removeAll(type) {
    Tracker.getInstances(type).length = 0
  }

  static updateAll() {
    for(const key of Object.keys(Tracker.instances)) {
      const instances = Tracker.instances[key]
      // update can remove the object, so use tradition indexed looping
      for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].update()
      }
    }
  }

  static renderAll() {
    for(const key of Object.keys(Tracker.instances)) {
      const instances = Tracker.instances[key]
        _.invoke(instances, 'render');
    }
  }
}
// Currently no way to declare static variables
Tracker.instances = {}
