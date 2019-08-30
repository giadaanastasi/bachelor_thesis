<?php
	require_once "/../config.php";
    require_once "/../util/sudokuDbManager.php"; //includes Database Class

 	
	function getValue($node, $parameter, $name){
		global $sudokuDb;

		if($node=="0"){
			if($parameter!="radio")
				$queryText='SELECT value,ts, unit, id_node '
					. 'FROM '.$parameter.' WHERE name=\''.$name.'\'  ORDER by ts DESC limit 60';
			else $queryText='SELECT value,ts, id_node '
					. 'FROM '.$parameter.' WHERE name=\''.$name.'\'  ORDER by ts DESC limit 60';
			$result = $sudokuDb->performQuery($queryText);
			$array = array();
			$index=array();
			while($row=$result->fetch_assoc()){
				$id_node=$row['id_node'];
				if(!isset($array[$id_node])){
					$index[$id_node]=0;
					$array[$id_node] = array();
				}
				$curr=$index[$id_node];
				if($parameter=="radio")
					$array[$id_node][$curr][0]="byte";
				else if($parameter=="power")
					$array[$id_node][$curr][0]="mW*1000";
				else $array[$id_node][$curr][0]=$row['unit'];

				$array[$id_node][$curr][1]=$row['ts'];

				if($parameter=="power")
					$array[$id_node][$curr][2]=intval($row['value']*1000);
				else $array[$id_node][$curr][2]=intval($row['value']);
				
				$index[$id_node]=intval($index[$id_node])+1;
			}
			$sudokuDb->closeConnection();
			return $array;	
		}
		else{
			if($parameter!="radio")
				$queryText='SELECT value, unit, id_node, ts '
						. 'FROM '.$parameter.' WHERE id_node='.$node.' AND name=\''.$name.'\' ORDER by ts ASC limit 10';
			else $queryText='SELECT value, id_node, ts '
						. 'FROM '.$parameter.' WHERE id_node='.$node.' AND name=\''.$name.'\' ORDER by ts ASC limit 10';
			$result = $sudokuDb->performQuery($queryText);
			$array = array();
			//$index=0;
			while($row=$result->fetch_assoc()){
				$id_node=$row['id_node'];
				if(!isset($array[$id_node])){
					$index=0;
					$array[$id_node] = array();
				}
				if($parameter=="radio")
					$array[$id_node][$index][0]="byte";
				else if($parameter=="power")
					$array[$id_node][$index][0]="mW*1000";
				else $array[$id_node][$index][0]=$row['unit'];
				$array[$id_node][$index][1]=$row['ts'];
				if($parameter=="power")
					$array[$id_node][$index][2]=intval($row['value']*1000);
				else $array[$id_node][$index][2]=intval($row['value']);
				$index++;
			}
			$sudokuDb->closeConnection();
			return $array;
		}
	}

	function  getGraph(){
		global $sudokuDb;

			$queryText='SELECT value, id_node, etx '
				. 'FROM radio WHERE name="best_neighbor_id" ORDER BY ts DESC limit 10';
			$result = $sudokuDb->performQuery($queryText);
			$array = array();
			$index=0;
			while($row=$result->fetch_assoc()){
				$array[$index][0]=$row['value'];
				$array[$index][1]=$row['id_node'];
				$array[$index][2]=$row['etx'];
				$index++;
			}
			$sudokuDb->closeConnection();
			return $array;	
	}	
?>
