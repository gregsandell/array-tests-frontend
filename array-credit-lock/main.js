'use strict';

(function () {
  class ArrayCreditLock extends HTMLElement {
    constructor () {
      // establish prototype chain
      super()
      this.shadowRootValue = this.attachShadow({ mode: 'open' })

      // get attribute values from getter
      const url = this.url

      this.getJsonData(url).then(() => {
        // creating a container for the array-credit-lock component
        const arrayCreditLockContainer = document.createElement('div')

        // creating the inner HTML of the editable list element
        arrayCreditLockContainer.innerHTML = `
          ${this.styleBlock()}
          <ul>
            ${this.createElements()}
          </ul>
          <p id="showall"></p>
        ` // end of backtick
        // appending the container to the shadow DOM
        this.shadowRootValue.appendChild(arrayCreditLockContainer)

        this.setShowMessage('Show All')

        const showAll = this.shadowRootValue.querySelector('#showall')
        showAll.addEventListener('click', () => {
          this.toggleHideShow()
        })
      }) // end of then()
    } // end of constructor

    // gathering data from element attributes
    get url () {
      return this.getAttribute('url') || ''
    }

    styleBlock () {
      return `<style>
           ul {
              padding-left: 0;
              text-align: left;
            }
            li.history-list:last-child {
              border-bottom: 1px solid #ededed;
            }
            li.history-list {
              padding: 20px 0;
              border-bottom: 1px solid #ededed;
              list-style: none;
            }
            .list-div {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
            .date {
                color: #696969;
                font-size: 16px;
            }  
            .lock {
                color: #333333;
                font-weight: 500;
                font-size: 16px;
                margin-left: 0;   
            }
            .hide {
                display: none;
            }
          </style>`
    }

    createElements () {
      return this.test_data.map((item, i) => `
              <li class='${i < 5 ? 'history-list' : 'history-list hide'}'>
                <div class="list-div">
                  <div class="date">${item.date}</div>
                  <div class="lock">${item.type === 'cancellation' ? 'Unlocked' : 'Locked'}</div>
                </div>
                </li>
            `).join('')
    }

    getJsonData (url) {
      return fetch(`../${url}`)
        .then(res => res.json())
        .then(data => {
          data.forEach((record) => {
            record.date = formatDate(record.date)
          })
          this.test_data = data
        })
    }

    setShowMessage (mesg) {
      const node = this.shadowRootValue.getElementById('showall')
      const size = `(${this.test_data.length})`
      node.textContent = `${mesg} ${mesg === 'Show All' ? size : ''}`
    }

    toggleHideShow () {
      const hideNodes = this.shadowRootValue.querySelectorAll('.hide')
      const hideElems = [].slice.call(hideNodes)
      const showNodes = this.shadowRootValue.querySelectorAll('.show')
      const showElems = [].slice.call(showNodes)
      if (hideElems.length > 0) {
        this.setShowMessage('Show Fewer')
        hideElems.forEach((elem) => {
          elem.classList.remove('hide')
          elem.classList.add('show')
        })
      }
      if (showElems.length > 0) {
        this.setShowMessage('Show All')
        showElems.forEach((elem) => {
          elem.classList.remove('show')
          elem.classList.add('hide')
        })
      }
    }
  } // end of class
  // let the browser know about the custom element
  customElements.define('array-credit-lock', ArrayCreditLock)

  const formatDate = (date) => {
    // eslint-disable-next-line new-cap, no-undef
    const mydate = new moment(date).tz('America/Los_Angeles')
    const offset = (mydate.utcOffset() / 60)
    return mydate.format('YYYY-MM-DD h:mmA') + ' GMT ' + offset
  }
})()
