
import React, { useEffect, useRef } from 'react';
// Fix: Use named imports to resolve property access errors on the d3 namespace
import { 
  select, 
  forceSimulation, 
  forceLink, 
  forceManyBody, 
  forceCenter, 
  forceCollide, 
  drag 
} from 'd3';
import { Concept } from '../types';

interface ConceptGraphProps {
  concepts: Concept[];
  onConceptClick: (concept: Concept) => void;
}

const ConceptGraph: React.FC<ConceptGraphProps> = ({ concepts, onConceptClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || concepts.length === 0) return;

    // Fix: Use named import 'select' directly
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes = concepts.map(c => ({ ...c }));
    const links: any[] = [];
    
    concepts.forEach(c => {
      c.connections.forEach(targetId => {
        if (concepts.find(node => node.id === targetId)) {
          links.push({ source: c.id, target: targetId });
        }
      });
    });

    // Fix: Use named imports for simulation and force-related functions
    const simulation = forceSimulation(nodes as any)
      .force("link", forceLink(links).id((d: any) => d.id).distance(140))
      .force("charge", forceManyBody().strength(-400))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collision", forceCollide().radius(70));

    const link = svg.append("g")
      .attr("stroke", "#1e293b")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#06b6d4")
      .style("stroke-dasharray", "4,4");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-crosshair group")
      .on("click", (event, d) => onConceptClick(d as any))
      // Fix: Use named import 'drag' instead of d3.drag
      .call(drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", (d: any) => 15 + (d.importance || 1) * 3)
      .attr("fill", "#0a0b10")
      .attr("stroke", "#2dd4bf")
      .attr("stroke-width", 2)
      .attr("class", "transition-all group-hover:stroke-white")
      .style("filter", "drop-shadow(0 0 5px rgba(45, 212, 191, 0.5))");

    node.append("text")
      .attr("dy", 38)
      .attr("text-anchor", "middle")
      .attr("class", "text-[10px] mono uppercase tracking-widest font-bold fill-slate-500 pointer-events-none")
      .text((d: any) => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [concepts, onConceptClick]);

  return (
    <div className="w-full h-full bg-[#0a0b10] rounded-sm border border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-[10px] mono font-bold text-slate-700 uppercase tracking-[0.4em]">NEURAL_TOPOLOGY_LOG</h3>
      </div>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default ConceptGraph;
