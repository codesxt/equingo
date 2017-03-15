window.equingo = (function () {
    function Equingo (els) {

    }

    var isOperator = function(element){
      return (element == '+' || element == '-' || element == '*' || element == '/' || element == '^');
    }

    var opPriority =  function(op){
      switch(op){
        case '+':
        case '-':
          return 1;
          break;
        case '*':
        case '/':
          return 2;
          break;
        case '^':
          return 3;
          break;
        default:
          return -1;
          break;
      }
    }

    var equingo = {
      info: function(){
        return "Equingo is a simple JavaScript library to transform formulas into MongoDB aggregation queries.";
      },
      stringToPostFix: function(equation){
        var result = "";
        var opStack = [];
        while(equation.length != 0){
          // Extraer elemento de la lista
          var E = equation.substr(0, 1);
          equation = equation.substr(1);

          if(!isOperator(E) && E != '(' && E != ')'){
            // Si el resultado es un número, añadir al final de la salida
            result+=E;
          }else if(E == '('){
            opStack.push(E);
          }else if(E == ')'){
            while(opStack.length != 0 && opStack[opStack.length-1] != '('){
              result += opStack.pop();
            }
            if(opStack[opStack.length-1] == '('){
              opStack.pop();
            }
          }else{
            // El elemento es un operador
            // Si en el tope de la pila hay un operador de igual o mayor procedencia, se añade al resultado
            while(opStack.length != 0 && opPriority(opStack[opStack.length-1]) >= opPriority(E)){
              result += opStack.pop();
            }
            opStack.push(E);
          }
        }

        while(opStack.length != 0){
          result += opStack.pop();
        }
        return result;
      },
      postFixToMongo: function(equation){
        var result = "";
        var opStack = [];
        while(equation.length != 0){
          // Extraer elemento de la lista
          var E = equation.substr(0, 1);
          equation = equation.substr(1);

          if(isOperator(E)){
            var a = opStack.pop();
            var b = opStack.pop();
            var operation = {};
            if(E=='+'){
              operation = {
                $sum: [a, b]
              }
            }else if(E=='-'){
              operation = {
                $subtract: [a, b]
              }
            }else if(E=='*'){
              operation = {
                $multiply: [a, b]
              }
            }else if(E=='/'){
              operation = {
                $divide: [a, b]
              }
            }else if(E=='^'){
              operation = {
                $pow: [a, b]
              }
            }
            opStack.push(operation);
          }else{
            // E es un operando
            opStack.push(E);
          }
        }
        result = opStack[0];
        return result;
      }
    };

    return equingo;
}());
