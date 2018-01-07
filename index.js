import ReactDOM from 'react-dom'
import {Component} from 'react';

window.RctDebugger = {
	components: {},
};
const RctDebugger = window.RctDebugger;




const decorator = function(DecoratedComponent, options) {

	const {prototype} = DecoratedComponent;
	const oldDidMount = prototype.componentDidMount;

	prototype.componentDidMount = function() {
		if (oldDidMount) {
			oldDidMount.call(this);
		}
		const name = DecoratedComponent.displayName || DecoratedComponent.name;
		const {components} = RctDebugger;
		if (!components[name]) {
			components[name] = {
				nodes: [],
				instances: [],
				getInstanceByNode: function(node) {
					const index = this.nodes.indexOf(node);
					return this.instances[index];
				},
				namedInstances: {},
			};
		}
		components[name].instances.push(this);
		components[name].nodes.push(ReactDOM.findDOMNode(this));
		if (options.getName) {
			components[name].namedInstances[options.getName(this.props)] = this;
		}
	};
	return DecoratedComponent;
}

const decoratorWrapper = function(argument) {
	if (!argument) {
		throw new Error("you have pass either Component or option object!");
	}
	if (argument.prototype instanceof Component) {
		return decorator(argument, {});
	} else {
		return function (DecoratedComponent) {
			return decorator(DecoratedComponent, argument);
		}
	}
}

export default decoratorWrapper;

