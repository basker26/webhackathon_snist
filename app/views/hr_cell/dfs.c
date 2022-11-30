#include<stdio.h>
#include <stdlib.h>
#define size 50
#define t 1
#define f 0
struct edge{
	int terminal;
	struct edge *next;
};
struct vertex {
	int visit;
	int vertex_no;
	char info;
	int path_length;
	struct edge *edge_ptr;
};
struct edge* insert(int vertex_no,struct edge *first){
	struct edge *new1 , *current;
	new1=(struct edge*)malloc(sizeof(struct edge));
	new1->terminal=vertex_no;
	new1->next =NULL;
	if(!first)
		return(new1);
	for(current = first;current->next;current=current->next);
	current->next=new1;
	return(first);
}
void table(int vertex_no,int matrix[size][size],struct vertex vert[size]){
	int i,j;
	for(i=0;i<vertex_no;i++){
		vert[i].visit=f;
		vert[i].vertex_no=i+1;
		vert[i].info='A'+i;
		vert[i].edge_ptr=NULL;
	}
	for(i=0;i<vertex_no;i++){
		for(j=0;j<vertex_no;j++){
			if(matrix[i][j]>0)
				vert[i].edge_ptr=insert(j,vert[i].edge_ptr);
		}
	}
}
void dfs(int index,int *dist,struct vertex vert[size]){
	struct edge *link;
	vert[index].visit=t;
	vert[index].path_length=*dist;
	*dist+=1;
	for(link=vert[index].edge_ptr;link;link=link->next)
		if(vert[link->terminal].visit==f)
			dfs(link->terminal,dist,vert);
		
}
void input(int number,int a[size][size]){
	int i,j;
	printf("\n input the adjacency matrix\n");
	for(i=0;i<number;i++){
   		for(j=0;j<number;j++){
			scanf("%d",&a[i][j]);
		}
		printf("\n");
	}
}
void output(int number,int a[size][size]){
	int i,j;
	printf("\n adjacency matrix\n");
	for(i=0;i<number;i++){
		for(j=0;j<number;j++){
			printf("%d",a[i][j]);
		}
		printf("\n");
	}
}
int main(){
	int i;
	int number,index,dist;
	int a[size][size];
	struct vertex vert[size];
	struct edge *list;
	printf("\n enter the no vertecies in the graph:");
	scanf("%d",&number);
	input(number,a);
	output(number,a);
	table(number,a,vert);
	printf("\n input the starting vertex 0-%d:",number-1);
	scanf("%d",&index);
	dist = 0;
	dfs(index,&dist,vert);
	printf("\n path length of the vertex from %c",vert[index].info);
	printf("\n vertex length vertex connetivity \n");
	for(i=0;i<number;i++){
		printf("\n %c %d ",vert[i].info,vert[i].path_length);
		for(list=vert[i].edge_ptr;list;list=list->next){
			printf(" ");
			putchar(list->terminal+'a');
		}
	}
	
}

