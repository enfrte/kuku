<?php 

namespace Models\Lessons;

class LessonsModel extends BaseModel
{
    public function __construct($db)
    {
        $table = 'lessons';
        $columns = array('id' , ...);
        $primaryKeys = array('id');
        parent::__construct($db, $table, $columns, $primaryKeys);
    }
}

