const AUTOFILLED = "is-autofilled";

const onAutoFillStart = (el: HTMLInputElement) => {
  const label: HTMLLabelElement = document.querySelector(
    `label[for="${el.id}"]`
  );
  label.classList.add("active");
  el.classList.add(AUTOFILLED);
};
const onAutoFillCancel = (el: HTMLInputElement) => {
  const label: HTMLLabelElement = document.querySelector(
    `label[for="${el.id}"]`
  );
  label.classList.remove("active");
  el.classList.remove(AUTOFILLED);
};

const onAnimationStart = ({ target, animationName }) => {
  switch (animationName.split("-")[2]) {
    case "onAutoFillStart":
      return onAutoFillStart(target);
    case "onAutoFillCancel":
      return onAutoFillCancel(target);
  }
};

export default onAnimationStart;
