import View from "../View";
import rain from "url:../../../imgs/raindrop.png";
import { LOAD_CURRENT_PANEL } from "../../config";
import moment from "moment";

class HourlyWeatherView extends View {
  _data; 
  _parentElement = document.getElementById("hourly-panel");
  _childElement = document.getElementById("hourly-panel--content");
  _sliderElements = document.querySelectorAll(".hourly-chart");
  _hourlyContainer = document.querySelector('.hourly-slider--container')

  _renderHourlyWeather(data) {
    const loadData = () => {
      this._clearChild();

      // show remainding hours
      const getCurrentDate = new Date();
      const hourSlice = getCurrentDate.getHours();
      this._data = data.slice(hourSlice);

      const renderHourly = this._data
        .map((data) => {
          const hourly = this._generateMarkup(data);

          return hourly;
          // add join('') to remove commas
          // check find a way to load what you need in terms of hours
        })
        .join("");
      this._childElement.insertAdjacentHTML("afterbegin", renderHourly);
       this._childElement.style.position = "absolute";
        this._childElement.style.position = "absolute";
        this._hourlyContainer.style.justifyContent = "center";
      // toggle between fahre
      this._togggleBetweenFahrenAndCelsuis();
      // create grabbing slider affect to hourly content //
      let isPressedDown = false;
      let cursorX;

      this._parentElement.addEventListener("mousedown", (e) => {
        isPressedDown = true;
        cursorX = e.offsetX - this._childElement.offsetLeft;
        this._parentElement.style.cursor = "grabbing";
      });
      window.addEventListener("mouseup", () => {
        isPressedDown = false;
      });
      this._parentElement.addEventListener("mouseup", (e) => {
        this._parentElement.style.cursor = "grab";
      });

      this._parentElement.addEventListener("mousemove", (e) => {
        if (!isPressedDown) return;
        e.preventDefault();
        this._childElement.style.left = `${e.offsetX - cursorX}px`;
        boundingHourlyRec();
      });
      const boundingHourlyRec = () => {
        const boundingContainer = this._parentElement.getBoundingClientRect();
        const boundingSlides = this._childElement.getBoundingClientRect();
        if (parseInt(this._childElement.style.left) > 0) {
          this._childElement.style.left = 0;
        } else if (boundingSlides.width < boundingContainer.width) {
          this._childElement.style.left = 0;
        } else if (boundingSlides.right < boundingContainer.right) {
          this._childElement.style.left = `-${
            boundingSlides.width - boundingContainer.width
          }px`;
        }
      };
    };
    setTimeout(loadData, LOAD_CURRENT_PANEL);
  }
  _generateMarkup(data) {
    return ` <div class="hourly-chart flex">
      <span class="hourly-chart--time"> ${moment(data.hour)
        .format("LT")
        .replaceAll(":00", "")}</span>
      <span> <img class="hourly-weather--icon" src="${data.img}"
              alt="hourly weather logo"></span>
      <span class="fahren"> ${data.degreeF}°F</span>
      <span class="celsius hidden"> ${data.degreeC}°C</span>
      <div class="hourly-rain--container">
          <img src="${rain}" alt="rain image"><span> ${data.rainChance}%</span>
      </div>
      </div>`;
  }
  renderSpinnerLoader() {
    const markup = `
    <div class='spinner-loader--container'> <div class='spinner-loader'> </div> </div>

    `;
    this._clearChild();
    this._childElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new HourlyWeatherView();
