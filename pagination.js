/**
 * Pagination Class
 *      Pass in Array of JSON Objects to display Pagination Element in given HTML Element.
 * 
 * @author Joseph Kasavage
 * @copyright 2024
 * @license MIT
 */

class Pagination {
    /**
     * @param {Array} data
     */
    #data;

    /**
     * @param {Number} page_size
     */
    #pageSize;

    /**
     * @param {HTMLElement} element
     */
    #element;

    /**
     * @param {Array} headers
     */
    #headers;

    /**
     * @param {HTMLElement} template
     */
    #template;

    /**
     * @param {Number} pageCount
     */
    #pageCount = 1;

    /**
     * @param {Number} cellCount
     */
    #cellCount = 0;

    /**
     * @param {Number} currentPage
     */
    #currentPage = 1;

    constructor(data, page_size, element, headers = null) {
        this.#data = data;
        this.#pageSize = page_size;
        this.#element = document.querySelector(element);
        this.#pageCount = Math.ceil(data.length / this.#pageSize);
        this.#headers = headers;

        if(headers) {
            this.#cellCount = headers.length;
        } else {
            this.#cellCount = Object.keys(data[0]).length;
        }

        this.#template = document.createElement('table');
        this.#template.id = 'pagination-table';
        this.#template.style.width = '100%';

        this.render();
    }

    /**
     * Render Pagination Table
     * 
     * @param {Number} page
     * 
     * @return {void}
     */
    render(page = null) {
        if(this.#headers) {
            this.packageHeaders();
        } else {
            let keys = Object.keys(this.#data[0]);
            
            this.packageKeys(keys);
        }

        /**
         * Selected Items from Data
         */
        let dataSlice;

        if(!page) {
            dataSlice = this.#data.slice(0, this.#pageSize);
        } else {
            let first = (page * this.#pageSize) - this.#pageSize;

            dataSlice = this.#data.slice(first, this.#pageSize * page);
        }

        dataSlice.forEach((entry) => {
            this.packageEntry(entry);
        });

        this.packageOptions();

        this.#element.appendChild(this.#template);
    }

    /**
     * Package Entry
     * 
     * @param {JSON} entry 
     */
    packageEntry(entry) {
        /**
         * Row Element
         * 
         * @param {HTMLElement} row
         */
        let row = document.createElement('tr');

        if(this.#headers) {
            this.#headers.forEach((header) => {
                let cell = document.createElement('td');
                cell.innerText = entry[header];
                row.appendChild(cell);
            });
        } else {
            for(const [key, value] of Object.entries(entry)) {
                let cell = document.createElement('td');
                cell.innerText = value;
                row.appendChild(cell);
            }
        }

        this.#template.appendChild(row);
    }

    /**
     * Package Headers if Headers Provided
     */
    packageHeaders() {
        let headerRow = document.createElement('tr');

        this.#headers.forEach(header => {
            let cell = document.createElement('td');
            cell.innerText = `${header}`;
            cell.style.textAlign = 'center';
            cell.style.fontWeight = 'bold';
            headerRow.appendChild(cell);
        });

        this.#template.appendChild(headerRow);
    }

    /**
     * Package Data Keys if no Headers Provided
     * 
     * @param {Array} keys 
     */
    packageKeys(keys) {
        let row = document.createElement('tr');

        keys.forEach(key => {
            let cell = document.createElement('td');
            cell.innerText = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
            cell.style.textAlign = 'center';
            cell.style.fontWeight = 'bold';
            row.appendChild(cell);
        });

        this.#template.appendChild(row);
    }

    /**
     * Package Options
     */
    packageOptions() {
        /**
         * Add Row Element for Pagination Options
         */
        let pageRow = document.createElement('tr'),
            pageCell = document.createElement('td');

        /**
         * Options Table Element
         */
        let optionsTable = document.createElement('table'),
            optionsRow = document.createElement('tr');

        optionsTable.style.width = '100%';

        /**
         * Previous Button Element
         */
        let previousButton = document.createElement('button');
        previousButton.innerText = 'Previous';
        previousButton.addEventListener('click', () => {
            this.previous(this.#currentPage - 1);
        });

        if(this.#currentPage <= 1) {
            previousButton.disabled = true;
        }

        let previousCell = document.createElement('td');
        previousCell.style.width = '25%';
        previousCell.appendChild(previousButton);
        optionsRow.appendChild(previousCell);

        /**
         * Next Button Element
         */
        let nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => {
            this.next(this.#currentPage + 1);
        });

        if((this.#currentPage + 1) > this.#pageCount) {
            nextButton.disabled = true;
        }

        let pages = this.packagePages(),
            pagesCell = document.createElement('td');
 
        pagesCell.appendChild(pages);
        pagesCell.style.width = '50%';
        pagesCell.style.textAlign = 'center';
        optionsRow.appendChild(pagesCell);

        if((this.#pageCount + 1) < this.#pageCount) {
            nextButton.disabled = true;
        }

        let nextCell = document.createElement('td');
        nextCell.style.width = '25%';
        nextCell.appendChild(nextButton);
        optionsRow.appendChild(nextCell);

        optionsTable.appendChild(optionsRow);
        pageCell.colSpan =  this.#cellCount;
        pageCell.appendChild(optionsTable);
        pageRow.appendChild(pageCell);

        this.#template.appendChild(pageRow);
    }

    /**
     * Package Pagination Pages
     */
    packagePages() {
        let pageTable = document.createElement('table'),
            pageTableRow = document.createElement('tr');

        for(let i = 1; i <= this.#pageCount; i++) {
            let pageCell = document.createElement('td'),
                pageLink = document.createElement('a');

            pageCell.style.textAlign = 'center';

            pageLink.innerText = i;
            pageLink.href = '#';
            
            if(i !== this.#currentPage) {
                pageLink.onclick = () => { this.goTo(i) };
            } else {
                pageLink.style.textDecoration = 'none';
            }
            
            pageCell.appendChild(pageLink);
            pageTableRow.appendChild(pageCell);
        };

        pageTable.appendChild(pageTableRow);
        
        return pageTable;
    }

    /**
     * Render Previous Page
     */
    previous() {
        this.removeTable();

        this.#currentPage--;

        this.render(this.#currentPage);
    }

    /**
     * Render Next Page
     */
    next() {
        this.removeTable();

        this.#currentPage++;

        this.render(this.#currentPage);
    }

    /**
     * Go To Page
     * 
     * @param {Number} page
     */
    goTo(page) {
        this.removeTable();
        this.render(page);
    }

    /**
     * Remove Table Contents
     */
    removeTable() {
       document.querySelector('#pagination-table').innerHTML = '';
       document.querySelector('#pagination-table').remove();
    }
}