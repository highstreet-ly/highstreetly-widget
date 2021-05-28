import { draftOrderStore, orderHasExpiredStore } from "./stores";
let draftOrder;
draftOrderStore.subscribe(x => (draftOrder = x));


let orderHasExpired;
orderHasExpiredStore.subscribe(x => (draftOrder = x));

export let outOfTime;

export function timer(timerElement, minsElement, secsElement, dispatch) {
  let now = new Date();
  let endDate = new Date();
  endDate =  new Date(draftOrder.reservationExpirationDate)
  let endTime = endDate.getTime();

  var timerInterval = setInterval(function () {

    let now = new Date();
    now = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() -1, now.getUTCMinutes(), now.getUTCSeconds());
    let nowTime = now;
    let t = endTime - nowTime;

    if (t >= 0) {

      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let secs = Math.floor((t % (1000 * 60)) / 1000);

      minsElement.innerHTML = ("0" + mins).slice(-2);

      secsElement.innerHTML = ("0" + secs).slice(-2);

    } else {
      outOfTime = true
      orderHasExpiredStore.set(true);
      dispatch('timeout');
      clearInterval(timerInterval)
    }

  }, 1000);
}
