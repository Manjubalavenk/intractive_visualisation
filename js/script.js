async function getSalarioMinimo() {
    try {
        const request = await fetch('data/us-wage.json')
        const data = request.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function init() {
    try {
        const width = 800
        const height = 400
        const padding = 30
        const barWidth = width / 275

        const tooltip = d3.select('.visHolder')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)

        const overlay = d3.select('.visHolder')
            .append('div')
            .attr('class', 'overlay')
            .style('opacity', 0)

        const svg = d3.select('.visHolder')
            .append('svg')
            .attr('width', width + 100)
            .attr('height', height + 60)

        const data = await getSalarioMinimo()

        const anios = data.map(dato => dato['year'])
        const salarios = data.map(dato => Number(String(dato['minimum_wage']).replace(',', '.')) || 0)

        svg.append('text')
            .attr('x', width - (width / 2) - 80)
            .attr('y', height + 20)
            .text('years')
            .attr('class', 'info')


        svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("minimum wage");


    svg.append('text')
      .attr('class', 'source')
      .attr('x',538)
      .attr('y', 456)
      .attr('text-anchor', 'start')
      .text('Manjunath Aderu -W9551487')

         // svg.append('text')
         //    .attr('x', width - (width / 2) - 100)
         //    .attr('y', height + 20)
         //    .text('Manjunath Aderu -W9551487')
         //    .attr('class', 'info')


        const salarioMaximo = d3.max(salarios)
        const linearScale = d3.scaleLinear()
            .domain([0, salarioMaximo])
            .range([height, 0])

        const salariosEscalados = salarios.map(salario => linearScale(salario))

        const xScale = d3.scaleLinear()
            .domain([d3.min(anios), d3.max(anios)])
            .range([padding, width - padding])

        const xAxis = d3.axisBottom()
            .scale(xScale)
        const yAxisScale = d3.scaleLinear()
            .domain([padding, salarioMaximo])
            .range([height - padding, 0])
        const yAxis = d3.axisLeft(yAxisScale)

        svg.append('g')
            .attr('transform', `translate(${padding}, ${height - padding})`)
            .attr('id', 'x-axis')
            .call(xAxis)


        svg.append('g')
            .attr('transform', `translate(${padding * 2}, 0)`)
            .attr('id', 'y-axis')
            .call(yAxis)

        d3.select('svg')
            .selectAll('rect')
            .data(salariosEscalados)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => new Date(data[i]['year'], 1))
            .attr('data-salario', (d, i) => Number(String(data[i]['minimum_wage']).replace(',', '.')) || 0)
            .attr('class', 'bar')
            .attr('fill', 'rgb(138,43,226)')
            .attr('x', (d, i) => xScale(anios[i]))
            .attr('y', d => d)
            .attr('width', `${barWidth}px`)
            .attr('height', (d, i) => Math.max(0, height - padding - d))
            .attr('index', (d, i) => i)
            .attr('transform', `translate(${padding}, 0)`)
            .on('mouseover', function(event, d) {
                const i = this.getAttribute('index')

                overlay.transition()
                    .duration(0)
                    .style('height', `${Math.max(0, height - padding - d)}px`)
                    .style('width', `${barWidth}px`)
                    .style('opacity', 0.9)
                    .style('left', `${xScale(anios[i])}px`)
                    .style('top', `${d}px`)
                    .style('transform', `translateX(${padding}px)`)

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9)

                tooltip.html(`${anios[i]}<br>$${salarios[i]} MXN`)
                    .attr('data-date', data[i]['year'])
                    .style('left', `${xScale(anios[i]) + 30}px`)
                    .style('top', `${height - 100}px`)
                    .style('transform', `translateX(${padding}px)`)
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0)
                overlay.transition().duration(200).style('opacity', 0)
            })

    } catch (error) {
        console.error(error)
    }
}

init()